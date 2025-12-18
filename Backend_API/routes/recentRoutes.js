const express = require("express");
const router = express.Router();
const controller = require("../controllers/recentController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, controller.getRecentSongs);
router.delete("/", auth, controller.clearRecent);

module.exports = router;
