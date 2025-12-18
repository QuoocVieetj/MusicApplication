const supabase = require("../config/supabaseAdmin");

exports.getAllUsers = async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
};

exports.getMe = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", req.user.uid)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
};

exports.getUserById = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
};

exports.updateUser = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .update(req.body)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

exports.deleteUser = async (req, res) => {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "User deleted" });
};
