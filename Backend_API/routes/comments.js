const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentController');

router.get('/', commentsController.getAll);
router.post('/', commentsController.create);
router.delete('/:id', commentsController.delete);

module.exports = router;
