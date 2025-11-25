const { db } = require("../config/firebase");

exports.getAll = async (req, res) => {
  try {
    const snap = await db.collection("playlists").get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (e) { res.status(500).json({ message: "Error" }) }
};

exports.create = async (req, res) => {
  try {
    const doc = await db.collection("playlists").add({
      ...req.body,
      createdAt: new Date().toISOString()
    });
    res.json({ id: doc.id });
  } catch (e) { res.status(500).json({ message: "Error" }) }
};

exports.update = async (req, res) => {
  try {
    await db.collection("playlists").doc(req.params.id).update(req.body);
    res.json({ message: "Updated" });
  } catch (e) { res.status(500).json({ message: "Error" }) }
};

exports.delete = async (req, res) => {
  try {
    await db.collection("playlists").doc(req.params.id).delete();
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ message: "Error" }) }
};
