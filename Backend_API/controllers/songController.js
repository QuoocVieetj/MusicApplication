const { db } = require("../config/firebase");

exports.getAll = async (req, res) => {
  try {
    const snap = await db.collection("songs").get();
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(list);
  } catch (e) { res.status(500).json({ message: "Error fetching songs" }) }
};

exports.getById = async (req, res) => {
  try {
    const doc = await db.collection("songs").doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) { res.status(500).json({ message: "Error fetching song" }) }
};

exports.create = async (req, res) => {
  try {
    const doc = await db.collection("songs").add(req.body);
    res.json({ message: "Created", id: doc.id });
  } catch (e) { res.status(500).json({ message: "Create failed" }) }
};

exports.update = async (req, res) => {
  try {
    await db.collection("songs").doc(req.params.id).update(req.body);
    res.json({ message: "Updated" });
  } catch (e) { res.status(500).json({ message: "Update failed" }) }
};

exports.delete = async (req, res) => {
  try {
    await db.collection("songs").doc(req.params.id).delete();
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ message: "Delete failed" }) }
};
