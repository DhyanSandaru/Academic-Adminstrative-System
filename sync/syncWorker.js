// syncWorker.js
const axios = require('axios');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');
const DEFAULT_CONFIG = {
  apiBase: 'http://localhost:8000/api',
  syncEndpoint: '/sync',
  batchSize: 20,
  pollIntervalMs: 10_000,
  maxAttempts: 8,
  baseBackoffMs: 2000,
  maxBackoffMs: 5 * 60 * 1000,
  deviceId: null
};

/* ---------- MySQL LocalDB Adapter ---------- */
class LocalDB {
  constructor(config) {
    this.pool = mysql.createPool({
      host: config.host || 'localhost',
      user: config.user || 'root',
      password: config.password || '',
      database: config.database || 'wiseway_local',
      waitForConnections: true,
      connectionLimit: 5
    });
    this.init();
  }

  async init() {
    const sql = `
      CREATE TABLE IF NOT EXISTS sync_queue (
        qid INT AUTO_INCREMENT PRIMARY KEY,
        table_name VARCHAR(100) NOT NULL,
        operation VARCHAR(20) NOT NULL,
        record_id VARCHAR(100) NOT NULL,
        payload JSON NOT NULL,
        created_at BIGINT NOT NULL,
        attempts INT DEFAULT 0,
        backoff_until BIGINT DEFAULT 0,
        processing TINYINT DEFAULT 0,
        last_error TEXT DEFAULT NULL
      );
    `;
    const conn = await this.pool.getConnection();
    await conn.query(sql);
    conn.release();
  }

  async enqueue(table_name, operation, record_id, payload) {
    const now = Date.now();
    const [res] = await this.pool.query(
      `INSERT INTO sync_queue (table_name, operation, record_id, payload, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [table_name, operation, record_id, JSON.stringify(payload), now]
    );
    return res.insertId;
  }

  async fetchBatch(limit) {
    const now = Date.now();
    const [rows] = await this.pool.query(
      `SELECT * FROM sync_queue
       WHERE processing = 0 AND backoff_until <= ?
       ORDER BY created_at ASC
       LIMIT ?`,
      [now, limit]
    );
    return rows;
  }

  async markProcessing(qid) {
    await this.pool.query(`UPDATE sync_queue SET processing = 1 WHERE qid = ?`, [qid]);
  }

  async markSuccess(qid) {
    await this.pool.query(`DELETE FROM sync_queue WHERE qid = ?`, [qid]);
  }

  async markFailure(qid, attempts, backoffUntil, errMsg) {
    await this.pool.query(
      `UPDATE sync_queue SET processing = 0, attempts = ?, backoff_until = ?, last_error = ? WHERE qid = ?`,
      [attempts, backoffUntil, errMsg ? String(errMsg).slice(0, 2000) : null, qid]
    );
  }

  async getById(qid) {
    const [rows] = await this.pool.query(`SELECT * FROM sync_queue WHERE qid = ?`, [qid]);
    return rows[0];
  }
}

/* ---------- Helper: exponential backoff w/ jitter ---------- */
function computeBackoff(baseMs, attempt, maxMs) {
  const raw = baseMs * Math.pow(2, Math.max(0, attempt - 1));
  const jitter = raw * 0.2;
  let v = raw + (Math.random() * jitter * 2 - jitter);
  if (v > maxMs) v = maxMs;
  return Math.floor(v);
}

/* ---------- SyncWorker class ---------- */
class SyncWorker {
  constructor(dbConfig, config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.config.deviceId = this.config.deviceId || this._getDeviceId();
    this.db = new LocalDB(dbConfig);
    this.running = false;
    this.timer = null;
    this.onLog = config.onLog || (() => {});
    this.onConflict = config.onConflict || null;
    this.axios = axios.create({ baseURL: this.config.apiBase, timeout: 30_000 });
    this.getAuthHeaders = config.getAuthHeaders || (async () => ({}));
  }

  _getDeviceId() {
    return `device-${os.hostname()}-${uuidv4().slice(0, 8)}`;
  }

  log(...args) { this.onLog && this.onLog(...args); }

  async enqueueChange(table, operation, id, payload) {
    return this.db.enqueue(table, operation, id, payload);
  }

  async start() {
    if (this.running) return;
    this.running = true;
    this.log('SyncWorker started');
    await this._loop();
    this.timer = setInterval(() => this._loop().catch(err => this.log('Sync loop error', err)), this.config.pollIntervalMs);
  }

  async stop() {
    this.running = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.log('SyncWorker stopped');
  }

  async _isOnline() {
    try {
      await this.axios.get('/_ping', { headers: await this.getAuthHeaders() });
      return true;
    } catch {
      return false;
    }
  }

  async _loop() {
    if (!this.running) return;
    if (!(await this._isOnline())) {
      this.log('offline, skipping sync');
      return;
    }

    const batch = await this.db.fetchBatch(this.config.batchSize);
    if (!batch.length) {
      this.log('no items to sync');
      return;
    }

    for (const q of batch) await this.db.markProcessing(q.qid);

    const payload = batch.map(q => ({
      qid: q.qid,
      table_name: q.table_name,
      operation: q.operation,
      record_id: q.record_id,
      payload: q.payload,
      attempts: q.attempts
    }));

    try {
      const headers = await this.getAuthHeaders();
      const resp = await this.axios.post(
        this.config.syncEndpoint,
        { items: payload, deviceId: this.config.deviceId },
        { headers }
      );
      const results = resp.data?.results || [];
      for (const r of results) {
        const qid = r.qid;
        if (r.ok) {
          await this.db.markSuccess(qid);
          this.log(`synced qid=${qid}`);
        } else {
          const original = await this.db.getById(qid);
          const attempts = (original?.attempts || 0) + 1;
          const backoffMs = computeBackoff(this.config.baseBackoffMs, attempts, this.config.maxBackoffMs);
          await this.db.markFailure(qid, attempts, Date.now() + backoffMs, r.message || 'sync failed');
          this.log(`sync failed qid=${qid}, attempts=${attempts}`);
        }
      }
    } catch (err) {
      this.log('batch POST failed', err.message || err);
      for (const q of batch) {
        const original = await this.db.getById(q.qid);
        const attempts = (original?.attempts || 0) + 1;
        const backoffMs = computeBackoff(this.config.baseBackoffMs, attempts, this.config.maxBackoffMs);
        await this.db.markFailure(q.qid, attempts, Date.now() + backoffMs, err.message);
      }
    }
  }
}

module.exports = SyncWorker;
