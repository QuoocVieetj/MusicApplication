const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const authSong = require('../middleware/auth');
const multer = require('multer');

// Cấu hình upload file
const storage = multer.diskStorage({
  destination: './uploads/songs/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/getAll', songController.getAllSongs);
router.get('/:id', songController.getSongById);
router.get('/artist/:artistId', songController.getSongsByArtist);
router.get('/album/:albumId', songController.getSongsByAlbum);
router.get('/genre/:genreId', songController.getSongsByGenre);

// artist
router.post('/create-song', authSong, upload.single('audio'), songController.createSong);
router.put('/update-song/:id', authSong, songController.updateSong);
router.delete('/delete-song/:id', auth, songController.deleteSong);

module.exports = router;
