// server/firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require("./utils/serviceAccountKey.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // optional if you also want RTDB:
  databaseURL: "https://institute-management-sys-3c305-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const database = admin.database();

module.exports = { admin, database };
