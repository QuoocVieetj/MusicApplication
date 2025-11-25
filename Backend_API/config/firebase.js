const admin = require("firebase-admin");
const serviceAccount = require("../firebase-key.json");

// Nếu app chưa init → init
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Firestore instance
const db = admin.firestore();

module.exports = { admin, db };
