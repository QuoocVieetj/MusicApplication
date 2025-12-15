const supabase = require('../config/supabase');

async function getAllArtists(req, res) {
  const { data, error } = await supabase.from('artists').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

async function getArtistById(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase.from('artists').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
}

async function createArtist(req, res) {
  const { id, name, avatar } = req.body;
  const { data, error } = await supabase.from('artists').insert([{ id, name, avatar }]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
}

async function updateArtist(req, res) {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('artists').update(updates).eq('id', id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
}

async function deleteArtist(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase.from('artists').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Artist deleted', data });
}

module.exports = {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist
};
