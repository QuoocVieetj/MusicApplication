const express = require("express");
const router = express.Router();
const controller = require("../controllers/songController");

router.get("/", controller.getAllSongs);
router.get("/:id", controller.getSongById);
router.post("/", controller.createSong);
router.put("/:id", controller.updateSong);
router.delete("/:id", controller.deleteSong);

module.exports = router;
