const supabase = require("../config/supabaseAdmin");

exports.getArtists = async (req, res) => {
  const { data, error } = await supabase.from("artists").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
};

exports.getArtistById = async (req, res) => {
  const { data, error } = await supabase
    .from("artists")
    .select("*, albums(*), songs(*)")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
};
