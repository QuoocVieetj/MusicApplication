const express = require('express');
const router = express.Router();
const playlistsController = require('../controllers/playlistController');

router.get('/', playlistsController.getAllPlaylists);
router.get('/:id', playlistsController.getPlaylistById);
router.post('/', playlistsController.createPlaylist);
router.put('/:id', playlistsController.updatePlaylist);
router.delete('/:id', playlistsController.deletePlaylist);

module.exports = router;
