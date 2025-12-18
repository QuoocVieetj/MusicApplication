const express = require("express");
const router = express.Router();

router.use("/users", require("./userRoutes"));
router.use("/artists", require("./artistRoutes"));
router.use("/genres", require("./genreRoutes"));
router.use("/albums", require("./albumRoutes"));
router.use("/songs", require("./songRoutes"));
router.use("/playlists", require("./playlistRoutes"));
router.use("/comments", require("./commentRoutes"));
router.use("/follows", require("./followRoutes"));
router.use("/recently-played", require("./recentRoutes"));

module.exports = router;
