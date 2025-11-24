const router = require("express").Router();
const auth = require("../middleware/auth");  // verify Firebase token
const c = require("../controllers/userController"); // sửa tên đúng với file của bạn

// PUBLIC
router.get("/", c.getAll);
router.get("/:id", c.getById);

// PROTECTED — Register từ app gửi idToken lên
router.post("/", auth, c.create);

// PROTECTED
router.put("/:id", auth, c.update);
router.delete("/:id", auth, c.delete);

module.exports = router;
