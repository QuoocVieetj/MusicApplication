const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/albumController");

// PUBLIC
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// PRIVATE (có token Firebase)
router.post("/", auth, controller.create);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.delete);

module.exports = router;

