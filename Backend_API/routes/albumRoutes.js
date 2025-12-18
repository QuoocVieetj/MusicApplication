const express = require("express");
const router = express.Router();
const controller = require("../controllers/albumController");
const optionalAuth = require("../middleware/optionalAuth");

router.get("/", optionalAuth, controller.getAlbums);
router.get("/:id", optionalAuth, controller.getAlbumById);

module.exports = router;
