const router = require("express").Router();
const c = require("../controllers/commentController");

router.get("/", c.getAll);
router.post("/", c.create);
router.delete("/:id", c.delete);

module.exports = router;
