const supabase = require("../config/supabaseAdmin");

exports.getMyPlaylists = async (req, res) => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", req.user.uid);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
};

exports.getPlaylistById = async (req, res) => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*, playlist_songs(song_id, songs(*))")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
};

exports.createPlaylist = async (req, res) => {
  const { data, error } = await supabase
    .from("playlists")
    .insert({
      name: req.body.name,
      user_id: req.user.uid,
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

exports.addSongToPlaylist = async (req, res) => {
  const { error } = await supabase.from("playlist_songs").insert({
    playlist_id: req.params.id,
    song_id: req.body.song_id,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Song added" });
};

exports.deletePlaylist = async (req, res) => {
  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Deleted" });
};
