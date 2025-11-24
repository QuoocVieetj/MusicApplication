const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

// Firebase Key
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

global.db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== ROUTES =====
app.use("/api/albums", require("./routes/albums"));
app.use("/api/artists", require("./routes/artists"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/playlists", require("./routes/playlists"));
app.use("/api/songs", require("./routes/songs"));
app.use("/api/users", require("./routes/users"));

const PORT = 8386;
app.listen(PORT, () => console.log(`🚀 Server at http://localhost:${PORT}`));
