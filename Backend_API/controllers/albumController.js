const supabase = require('../config/supabase');

async function getAllAlbums(req, res) {
  const { data, error } = await supabase.from('albums').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

async function getAlbumById(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase.from('albums').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
}

async function createAlbum(req, res) {
  const { id, title, artist_id, cover_url } = req.body;
  const { data, error } = await supabase.from('albums').insert([{ id, title, artist_id, cover_url }]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
}

async function updateAlbum(req, res) {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('albums').update(updates).eq('id', id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
}

async function deleteAlbum(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase.from('albums').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Album deleted', data });
}

module.exports = {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum
};
