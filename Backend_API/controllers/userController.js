const supabase = require('../config/supabase');

// GET all users
async function getAllUsers(req, res) {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// GET user by ID
async function getUserById(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
}

// CREATE new user
async function createUser(req, res) {
  const { id, name, avatar } = req.body;
  const { data, error } = await supabase.from('users').insert([{ id, name, avatar }]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
}

// UPDATE user
async function updateUser(req, res) {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('users').update(updates).eq('id', id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
}

// DELETE user
async function deleteUser(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase.from('users').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'User deleted', data });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
