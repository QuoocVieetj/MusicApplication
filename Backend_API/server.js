const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import Firebase config (đã được init trong config/firebase.js)
require("./config/firebase");

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

// Lấy IP address động
const os = require('os');
const networkInterfaces = os.networkInterfaces();
let ipAddress = '192.168.1.71'; // default

for (const interfaceName in networkInterfaces) {
  for (const iface of networkInterfaces[interfaceName]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      ipAddress = iface.address;
      break;
    }
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at:`);
  console.log(`   - http://localhost:${PORT}`);
  console.log(`   - http://${ipAddress}:${PORT}`);
});

