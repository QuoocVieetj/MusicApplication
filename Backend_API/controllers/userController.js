// =========================
// USERS CONTROLLER MERGED
// =========================

// Firestore DB
const { db } = require("../config/firebase");

// =========================
// GET ALL USERS
// =========================
exports.getAll = async (req, res) => {
  try {
    const snap = await db.collection("users").get();
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
};

// =========================
// GET USER BY ID
// =========================
exports.getById = async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
};

// =========================
// CREATE USER (SAFE VERSION)
// =========================
exports.create = async (req, res) => {
  try {
    const tokenUser = req.user; // Firebase token đã verify  
    const body = req.body;

    // ❗ KIỂM TRA BẢO MẬT:
    // userId từ client phải KHỚP với uid trong Firebase Token
    if (!tokenUser || tokenUser.uid !== body.userId) {
      return res.status(403).json({ message: "Không hợp lệ: userId mismatch" });
    }

    // Nếu client không gửi createdAt → tự thêm
    body.createdAt = body.createdAt || new Date().toISOString();

    // Lưu Firestore
    const doc = await db.collection("users").add(body);

    res.json({
      id: doc.id,
      ...body,
    });

  } catch (e) {
    console.error("❌ Create user error:", e);
    res.status(500).json({ message: "Error creating user" });
  }
};

// =========================
// UPDATE USER
// =========================
exports.update = async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).update(req.body);
    res.json({ message: "Updated" });
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
};

// =========================
// DELETE USER
// =========================
exports.delete = async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).delete();
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
};
