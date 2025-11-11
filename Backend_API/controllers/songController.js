const con = require('../db/connection');
const path = require('path');


exports.getAllSongs = (req, res) => {
  const sql = `
    SELECT s.*, a.stage_name, al.title AS album_title
    FROM songs s
    JOIN artists a ON s.artist_id = a.artist_id
    LEFT JOIN albums al ON s.album_id = al.album_id
    WHERE s.status = 'approved'
    ORDER BY s.created_at DESC
  `;
  con.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
exports.getSongById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT s.*, a.stage_name, al.title AS album_title
    FROM songs s
    JOIN artists a ON s.artist_id = a.artist_id
    LEFT JOIN albums al ON s.album_id = al.album_id
    WHERE s.song_id = ?
  `;
  con.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: "Song not found" });
    res.json(results[0]);
  });
};
exports.getSongsByArtist = (req, res) => {
  const { artistId } = req.params;
  con.query(`SELECT * FROM songs WHERE artist_id = ?`, [artistId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
exports.getSongsByAlbum = (req, res) => {
  const { albumId } = req.params;
  con.query(`SELECT * FROM songs WHERE album_id = ?`, [albumId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
exports.getSongsByGenre = (req, res) => {
  const { genreId } = req.params;
  const sql = `
    SELECT s.*
    FROM songs s
    JOIN song_genres sg ON s.song_id = sg.song_id
    WHERE sg.genre_id = ?
  `;
  con.query(sql, [genreId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
exports.createSong = (req, res) => {
  const { artist_id, album_id, title, duration, cover_url } = req.body;
  let audio_url = req.body.audio_url;

  // Nếu upload file mp3
  if (req.file) {
    audio_url = `${req.protocol}://${req.get('host')}/uploads/songs/${req.file.filename}`;
  }

  const sql = `
    INSERT INTO songs (artist_id, album_id, title, duration, audio_url, cover_url, status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
  `;
  con.query(sql, [artist_id, album_id || null, title, duration || 0, audio_url, cover_url || null], (err, result) => {
    if (err) 
        return res.status(500).json({ error: err.message });
    res.json({ message: "Song created (pending approval)", song_id: result.insertId });
  });
};
exports.updateSong = (req, res) => {
  const { id } = req.params;
  const { title, lyrics, duration, cover_url } = req.body;
  const sql = `
    UPDATE songs
    SET title = ?, lyrics = ?, duration = ?, cover_url = ?, updated_at = CURRENT_TIMESTAMP
    WHERE song_id = ?
  `;
  con.query(sql, [title, lyrics, duration, cover_url, id], (err, result) => {
    if (err) 
        return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) 
        return res.status(404).json({ error: "Song not found" });
    res.json({ message: "Song updated successfully" });
  });
};
exports.deleteSong = (req, res) => {
  const { id } = req.params;
  con.query(`DELETE FROM songs WHERE song_id = ?`, [id], (err, result) => {
    if (err) 
        return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) 
        return res.status(404).json({ error: "Song not found" });
    res.json({ message: "Song deleted successfully" });
  });
};