const { adminAuth } = require("../firebaseAdmin.js");

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.*)$/);

  if (!match) return res.status(401).json({ message: "Missing auth token" });

  const token = match[1];
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = { verifyFirebaseToken };
