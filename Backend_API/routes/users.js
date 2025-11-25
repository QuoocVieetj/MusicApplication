const router = require("express").Router();

// Middleware verify Firebase Token
const auth = require("../middleware/auth");

// Controller
const c = require("../controllers/userController");

// =====================
// PUBLIC ROUTES
// =====================
router.get("/", c.getAll);
router.get("/:id", c.getById);

// =====================
// PROTECTED ROUTES
// =====================
// Firebase Auth bắt buộc → token hợp lệ mới tạo user
router.post("/", auth, c.create);

// Các route cần đăng nhập
router.put("/:id", auth, c.update);
router.delete("/:id", auth, c.delete);

module.exports = router;

