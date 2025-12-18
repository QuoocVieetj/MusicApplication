const supabase = require("../config/supabaseAdmin");

exports.getSongs = async (req, res) => {
  const { data, error } = await supabase
    .from("songs")
    .select("*, artists(name), albums(title)");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
};

exports.getSongById = async (req, res) => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
};

exports.likeSong = async (req, res) => {
  const { error } = await supabase.from("song_likes").insert({
    song_id: req.params.id,
    user_id: req.user.uid,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Liked" });
};

exports.addRecent = async (req, res) => {
  await supabase.from("recent").delete().match({
    user_id: req.user.uid,
    song_id: req.params.id,
  });

  const { error } = await supabase.from("recent").insert({
    user_id: req.user.uid,
    song_id: req.params.id,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Added to recent" });
};
