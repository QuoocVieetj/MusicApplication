const supabase = require("../config/supabaseAdmin");

exports.getCommentsBySong = async (req, res) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*, users(name, avatar)")
    .eq("song_id", req.params.songId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
};

exports.createComment = async (req, res) => {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      song_id: req.params.songId,
      user_id: req.user.uid,
      content: req.body.content,
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

exports.deleteComment = async (req, res) => {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Deleted" });
};
