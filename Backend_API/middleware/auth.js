const admin = require("firebase-admin");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token Firebase
    const decoded = await admin.auth().verifyIdToken(token);

    // Lưu user vào request
    req.user = decoded; // chứa uid, email,…

    next();
  } catch (error) {
    console.error("❌ Firebase auth error:", error);
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};
