const supabase = require('../config/supabase');

async function getAllPlaylists(req, res) {
  const { data, error } = await supabase.from('playlists').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

async function getPlaylistById(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase.from('playlists').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
}

async function createPlaylist(req, res) {
  const playlist = req.body;
  const { data, error } = await supabase.from('playlists').insert([playlist]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
}

async function updatePlaylist(req, res) {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('playlists').update(updates).eq('id', id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
}

async function deletePlaylist(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase.from('playlists').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Playlist deleted', data });
}

module.exports = {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
};
