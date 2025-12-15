const supabase = require("../config/supabase");
const crypto = require("crypto");

// ================= GET ALL =================
async function getAllSongs(req, res) {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  // map snake_case -> camelCase
  const mapped = data.map((s) => ({
    ...s,
    imageUrl: s.image_url,
    audioUrl: s.audio_url,
  }));

  res.json(mapped);
}

// ================= GET BY ID =================
async function getSongById(req, res) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: error.message });

  res.json({
    ...data,
    imageUrl: data.image_url,
    audioUrl: data.audio_url,
  });
}

// ================= CREATE =================
async function createSong(req, res) {
  const {
    title,
    imageUrl,
    audioUrl,
    artistId,
    albumId,
    genreId,
    durationMs,
    lyricsPlain,
    lyricsSynced,
  } = req.body;

  const { data, error } = await supabase
    .from("songs")
    .insert([
      {
        id: crypto.randomUUID(),
        title,
        image_url: imageUrl,
        audio_url: audioUrl,
        artist_id: artistId || null,
        album_id: albumId || null,
        genre_id: genreId || null,
        duration_ms: durationMs || null,
        lyrics_plain: lyricsPlain || null,
        lyrics_synced: lyricsSynced || null,
      },
    ])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
}

// ================= UPDATE =================
async function updateSong(req, res) {
  const { id } = req.params;
  const {
    title,
    imageUrl,
    audioUrl,
    artistId,
    albumId,
    genreId,
    durationMs,
  } = req.body;

  const { data, error } = await supabase
    .from("songs")
    .update({
      title,
      image_url: imageUrl,
      audio_url: audioUrl,
      artist_id: artistId,
      album_id: albumId,
      genre_id: genreId,
      duration_ms: durationMs,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}

// ================= DELETE =================
async function deleteSong(req, res) {
  const { id } = req.params;

  const { error } = await supabase.from("songs").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Deleted", id });
}

module.exports = {
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
};
