const con = require('../db/connection');

exports.getAllArtists = (req, res) => {
  const sql = `SELECT artist_id, stage_name, bio, verified, verified_at, created_at
               FROM artists ORDER BY verified DESC, stage_name ASC`;
  con.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
exports.getArtistById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT a.*, u.username, u.avatar_url
               FROM artists a
               JOIN users u ON a.user_id = u.user_id
               WHERE a.artist_id = ?`;
  con.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: "Artist not found" });
    res.json(results[0]);
  });
};
exports.registerArtist = (req, res) => {
  const userId = req.user.user_id;
  const { stage_name, bio } = req.body;

  con.query('SELECT * FROM artists WHERE user_id = ?', 
    [userId], 
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length) return res.status(400).json({ error: "You are already an artist" });

      con.query('INSERT INTO artists (user_id, stage_name, bio) VALUES (?, ?, ?)',
        [userId, stage_name, bio || null],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          // Cập nhật role user -> 'artist'
          con.query('UPDATE users SET role = "artist" WHERE user_id = ?', [userId]);
          res.json({ message: "Artist profile created", artist_id: result.insertId });
        });
  });
};
exports.updateArtistProfile = (req, res) => {
  const artistId = req.params.id;
  const { stage_name, bio } = req.body;
  const sql = 'UPDATE artists SET stage_name = ?, bio = ?, updated_at = CURRENT_TIMESTAMP WHERE artist_id = ?';

  con.query(sql ,
    [stage_name, bio, artistId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Artist profile updated" });
    });
};
exports.getArtistSongs = (req, res) => {
  const artistId = req.params.id;
  const sql = `SELECT song_id, title, likes_count, views_count, status, created_at
               FROM songs WHERE artist_id = ? ORDER BY created_at DESC`;
  con.query(sql, [artistId], (err, results) => {
    if (err) 
      return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
exports.verifyArtist = (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Admin only' });

  const { id } = req.params;
  const sql = 'UPDATE artists SET verified = TRUE, verified_at = CURRENT_TIMESTAMP WHERE artist_id = ?';
  con.query(sql, [id], (err, result) => {
    if (err) 
      return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) 
      return res.status(404).json({ error: "Artist not found" });
    res.json({ message: "Artist verified successfully" });
  });
};
