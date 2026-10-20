// socketManager.js
// Handles the Socket.IO reverse-verification flow.
// Students connect → get a 3-digit number → admin authorizes → JWT pushed to student socket.

const jwt = require('jsonwebtoken');
require('dotenv').config();

// In-memory store: socketId → { number, connectedAt }
const waitingRoom = new Map();

// Reverse lookup: number → socketId  (for fast O(1) lookup on authorize)
const numberToSocket = new Map();

/**
 * Generates a unique random 3-digit number (100–999) not already in use.
 */
function generateUniqueNumber() {
  const inUse = new Set(numberToSocket.keys());
  // 900 possible slots (100–999) — more than enough for any physical waiting room
  if (inUse.size >= 900) throw new Error('Waiting room is full');

  let num;
  do {
    num = Math.floor(Math.random() * 900) + 100; // 100 to 999 inclusive
  } while (inUse.has(num));

  return num;
}

/**
 * Builds the plain waiting room snapshot sent to admin sockets.
 */
function getWaitingRoomSnapshot() {
  const entries = [];
  for (const [socketId, data] of waitingRoom.entries()) {
    entries.push({ number: data.number, connectedAt: data.connectedAt });
  }
  // Sort by arrival time so admin sees them in order
  entries.sort((a, b) => a.connectedAt - b.connectedAt);
  return entries;
}

/**
 * Broadcasts the current waiting room state to all admin sockets.
 */
function broadcastWaitingRoom(io) {
  io.to('admins').emit('waiting_room_update', getWaitingRoomSnapshot());
}

/**
 * Initialises all Socket.IO event handlers.
 * Call this once from server.js after creating the io instance.
 * @param {import('socket.io').Server} io
 */
function initSocketManager(io) {
  io.on('connection', (socket) => {
    const clientType = socket.handshake.query.clientType;

    // ── Admin connection ───────────────────────────────────────────────────────
    if (clientType === 'admin') {
      socket.join('admins');
      console.log(`[Socket] Admin connected: ${socket.id}`);

      // Immediately send current snapshot so admin panel is populated on load
      socket.emit('waiting_room_update', getWaitingRoomSnapshot());

      // Admin emits this when they click "Authorize" on a waiting number
      socket.on('authorize_student', (number) => {
        const studentSocketId = numberToSocket.get(number);

        if (!studentSocketId) {
          socket.emit('authorize_error', { message: `No active session for number ${number}` });
          return;
        }

        // Sign a 15-minute JWT. Payload carries the assigned number as a soft identifier.
        const token = jwt.sign(
          { registrationNumber: number, purpose: 'remote_registration' },
          process.env.JWT_SECRET,
          { expiresIn: '15m' }
        );

        // Push token directly to the student's socket
        io.to(studentSocketId).emit('registration_authorized', { token });

        // Clean up — the student is no longer in the waiting room
        waitingRoom.delete(studentSocketId);
        numberToSocket.delete(number);

        console.log(`[Socket] Authorized number ${number} (socket ${studentSocketId})`);
        broadcastWaitingRoom(io);
      });

      socket.on('disconnect', () => {
        console.log(`[Socket] Admin disconnected: ${socket.id}`);
      });

      return;
    }

    // ── Student connection ─────────────────────────────────────────────────────
    let assignedNumber;
    try {
      assignedNumber = generateUniqueNumber();
    } catch (err) {
      console.error('[Socket] Could not assign number:', err.message);
      socket.emit('assignment_error', { message: 'Waiting room is currently full. Please try again.' });
      socket.disconnect(true);
      return;
    }

    waitingRoom.set(socket.id, { number: assignedNumber, connectedAt: Date.now() });
    numberToSocket.set(assignedNumber, socket.id);
    console.log(`[Socket] Student connected: ${socket.id} → number ${assignedNumber}`);

    // Tell the student their number
    socket.emit('assigned_number', { number: assignedNumber });

    // Tell all admins a new student is waiting
    broadcastWaitingRoom(io);

    socket.on('disconnect', () => {
      const data = waitingRoom.get(socket.id);
      if (data) {
        numberToSocket.delete(data.number);
        waitingRoom.delete(socket.id);
        console.log(`[Socket] Student ${data.number} disconnected (${socket.id})`);
        broadcastWaitingRoom(io);
      }
    });
  });
}

module.exports = { initSocketManager };
