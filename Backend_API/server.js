require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

/* ========================
   GLOBAL MIDDLEWARE
======================== */
app.use(cors());
app.use(express.json());

/* ========================
   ROUTES
======================== */
app.use("/api", require("./routes")); // ⬅ dùng index.js

/* ========================
   HEALTH CHECK
======================== */
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "API is running 🚀" });
});

/* ========================
   ERROR HANDLER
======================== */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

/* ========================
   START SERVER
======================== */
const PORT = process.env.PORT || 8386;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on:`);
  console.log(`   http://localhost:${PORT}`);
});
