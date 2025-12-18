const express = require("express");
const router = express.Router();
const controller = require("../controllers/songController");
const optionalAuth = require("../middleware/optionalAuth");
const auth = require("../middleware/authMiddleware");

router.get("/", optionalAuth, controller.getSongs);
router.get("/:id", optionalAuth, controller.getSongById);

// user actions
router.post("/:id/like", auth, controller.likeSong);
router.post("/:id/recent", auth, controller.addRecent);

module.exports = router;
