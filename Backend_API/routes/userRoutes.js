const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, controller.getAllUsers);
router.get("/me", auth, controller.getMe);
router.get("/:id", controller.getUserById);
router.put("/:id", auth, controller.updateUser);
router.delete("/:id", auth, controller.deleteUser);

module.exports = router;
