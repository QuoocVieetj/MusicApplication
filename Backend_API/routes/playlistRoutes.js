const express = require("express");
const router = express.Router();
const controller = require("../controllers/playlistController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, controller.getMyPlaylists);
router.get("/:id", auth, controller.getPlaylistById);
router.post("/", auth, controller.createPlaylist);
router.post("/:id/songs", auth, controller.addSongToPlaylist);
router.delete("/:id", auth, controller.deletePlaylist);

module.exports = router;
