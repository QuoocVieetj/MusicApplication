const express = require("express");
const router = express.Router();
const controller = require("../controllers/followController");
const auth = require("../middleware/authMiddleware");

router.post("/artist/:artistId", auth, controller.followArtist);
router.delete("/artist/:artistId", auth, controller.unfollowArtist);
router.get("/artists", auth, controller.getFollowedArtists);

module.exports = router;
