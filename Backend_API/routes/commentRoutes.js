const express = require("express");
const router = express.Router();
const controller = require("../controllers/commentController");
const auth = require("../middleware/authMiddleware");

router.get("/song/:songId", controller.getCommentsBySong);
router.post("/song/:songId", auth, controller.createComment);
router.delete("/:id", auth, controller.deleteComment);

module.exports = router;
