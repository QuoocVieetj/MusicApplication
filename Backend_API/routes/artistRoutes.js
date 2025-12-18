const express = require("express");
const router = express.Router();
const controller = require("../controllers/artistController");
const optionalAuth = require("../middleware/optionalAuth");

router.get("/", optionalAuth, controller.getArtists);
router.get("/:id", optionalAuth, controller.getArtistById);

module.exports = router;
