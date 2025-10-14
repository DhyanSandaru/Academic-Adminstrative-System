const mysql = require("mysql2/promise");
const { adminFirestore } = require("../firebaseAdmin");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "test_db"
});

async function syncToFirestore() {
  console.log("🌀 Starting sync from MySQL → Firestore...");
  try {
    const [students] = await db.query("SELECT * FROM students");
    const batch = adminFirestore.batch();

    for (const s of students) {
      const ref = adminFirestore.collection("students").doc(s.student_id.toString());
      batch.set(ref, s, { merge: true });
    }

    await batch.commit();
    console.log("✅ Firestore sync complete!");
  } catch (err) {
    console.error("Sync failed:", err);
  }
}

async function restoreFromFirestore() {
  console.log("⬇Checking for Firestore → MySQL restore...");
  try {
    const snapshot = await adminFirestore.collection("students").get();
    for (const doc of snapshot.docs) {
      const data = doc.data();
      await db.query(
        "REPLACE INTO students (student_id, student_name, email, gender) VALUES (?, ?, ?, ?)",
        [data.student_id, data.student_name, data.email, data.gender]
      );
    }
    console.log("Restore complete!");
  } catch (err) {
    console.error("Restore failed:", err);
  }
}

module.exports = { syncToFirestore, restoreFromFirestore };
