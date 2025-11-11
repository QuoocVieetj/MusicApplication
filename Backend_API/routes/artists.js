const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const authMiddleware = require('../middleware/auth');


router.get('/getAll', artistController.getAllArtists);
router.get('/:id', artistController.getArtistById);
router.get('/:id/songs', artistController.getArtistSongs);

router.post('/verify/:id', authMiddleware, artistController.verifyArtist);
router.post('/register', authMiddleware, artistController.registerArtist);

router.put('/:id', authMiddleware, artistController.updateArtistProfile);


module.exports = router