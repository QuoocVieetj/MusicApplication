// exports.getAll = async (req, res) => {
//   try {
//     const snap = await db.collection("users").get();
//     res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//   } catch (e) { res.status(500).json({ message: "Error" }) }
// };

// exports.getById = async (req, res) => {
//   try {
//     const doc = await db.collection("users").doc(req.params.id).get();
//     res.json({ id: doc.id, ...doc.data() });
//   } catch (e) { res.status(500).json({ message: "Error" }) }
// };

// exports.create = async (req, res) => {
//   try {
//     const doc = await db.collection("users").add({
//       ...req.body,
//       createdAt: new Date().toISOString()
//     });
//     res.json({ id: doc.id });
//   } catch (e) { res.status(500).json({ message: "Error" }) }
// };

// exports.update = async (req, res) => {
//   try {
//     await db.collection("users").doc(req.params.id).update(req.body);
//     res.json({ message: "Updated" });
//   } catch (e) { res.status(500).json({ message: "Error" }) }
// };

// exports.delete = async (req, res) => {
//   try {
//     await db.collection("users").doc(req.params.id).delete();
//     res.json({ message: "Deleted" });
//   } catch (e) { res.status(500).json({ message: "Error" }) }
// };
exports.getAll = async (req, res) => {
  try {
    const snap = await db.collection("users").get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
};

exports.create = async (req, res) => {
  try {
    const tokenUser = req.user; // Firebase token đã verify

    // Dữ liệu gửi từ app
    const body = req.body;

    // ❗ BẮT BUỘC: userId trong body phải khớp với uid của token
    if (!tokenUser || tokenUser.uid !== body.userId) {
      return res.status(403).json({ message: "Không hợp lệ" });
    }

    // Thêm createdAt nếu người dùng không gửi
    body.createdAt = body.createdAt || new Date().toISOString();

    const doc = await db.collection("users").add(body);

    res.json({
      id: doc.id,
      ...body
    });

  } catch (e) {
    console.error("Create user error:", e);
    res.status(500).json({ message: "Error creating user" });
  }
};

exports.update = async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).update(req.body);
    res.json({ message: "Updated" });
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
};

exports.delete = async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).delete();
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
};
