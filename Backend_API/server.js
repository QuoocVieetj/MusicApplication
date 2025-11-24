const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

// ====== KẾT NỐI FIREBASE ======
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ====== TẠO SERVER EXPRESS ======
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ====== API 1: LẤY MUSIC ======
app.get("/api/music", async (req, res) => {
  try {
    const snapshot = await db.collection("songs").get();
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(list);
  } catch (error) {
    console.error("❌ Error fetching music:", error);
    res.status(500).json({ message: "Error fetching music" });
  }
});

// ====== API 2: LẤY MUSIC THEO ID ======
app.get("/api/music/:id", async (req, res) => {
  try {
    const doc = await db.collection("songs").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    console.error("❌ Error fetching music by id:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ====== API 3: THÊM MUSIC ======
app.post("/api/post", async (req, res) => {
  try {
    const { title, artist, image, duration, category } = req.body;

    if (!title)
      return res.status(400).json({ message: "Missing title field" });

    const docRef = await db.collection("music").add({
      title,
      artist,
      image,
      duration,
      category,
      createdAt: new Date(),
    });

    res.status(200).json({
      message: "Music added successfully",
      id: docRef.id,
    });
  } catch (error) {
    console.error("❌ Error adding music:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// ====== API 4: xoa DANH SÁCH MUSIC ======

app.delete("/api/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await db.collection("music").doc(id).delete();

    res.json({ message: "Deleted", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
});


// ====== CHẠY SERVER ======
const PORT = 5555;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
