const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songController');

router.get('/', songsController.getAllSongs);
router.get('/search', songsController.searchSongs); 
router.get('/:id', songsController.getSongById);
router.post('/', songsController.createSong);
router.put('/:id', songsController.updateSong);
router.delete('/:id', songsController.deleteSong);

module.exports = router;
