const supabase = require("../config/supabaseAdmin");

exports.getAlbums = async (req, res) => {
  const { data, error } = await supabase
    .from("albums")
    .select("*, artists(name)");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
};

exports.getAlbumById = async (req, res) => {
  const { data, error } = await supabase
    .from("albums")
    .select("*, songs(*)")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
};
