const express = require("express");
const router = express.Router();
const controller = require("../controllers/albumController");

router.get("/", controller.getAllAlbums);
router.get("/:id", controller.getAlbumById);
router.post("/", controller.createAlbum);
router.put("/:id", controller.updateAlbum);
router.delete("/:id", controller.deleteAlbum);

module.exports = router;
