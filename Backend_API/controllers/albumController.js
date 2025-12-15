const supabase = require("../config/supabase");

/* ================= GET ALL ================= */
async function getAllAlbums(req, res) {
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("GET ALBUMS ERROR:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
}

/* ================= GET BY ID ================= */
async function getAlbumById(req, res) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Album not found" });
  }

  res.json(data);
}

/* ================= CREATE ================= */
async function createAlbum(req, res) {
  const { id, title, artistId, coverUrl } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: "id and title are required" });
  }

  const { data, error } = await supabase
    .from("albums")
    .insert([
      {
        id: String(id).trim(),
        title,
        artist_id: artistId ? String(artistId).trim() : null,
        cover_url: coverUrl || null,
      },
    ])
    .select()
    .maybeSingle();

  if (error) {
    console.log("CREATE ALBUM ERROR:", error);
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
}

/* ================= UPDATE ================= */
async function updateAlbum(req, res) {
  const { id } = req.params;
  const { title, artistId, coverUrl } = req.body;

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (artistId !== undefined)
    updates.artist_id = artistId ? String(artistId).trim() : null;
  if (coverUrl !== undefined) updates.cover_url = coverUrl;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const { data, error } = await supabase
    .from("albums")
    .update(updates)
    .eq("id", String(id).trim())
    .select();

  if (error) {
    console.log("UPDATE ALBUM ERROR:", error);
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "Album not found" });
  }

  res.json(data[0]);
}

/* ================= DELETE ================= */
async function deleteAlbum(req, res) {
  const { id } = req.params;

  const { error } = await supabase
    .from("albums")
    .delete()
    .eq("id", String(id).trim());

  if (error) {
    console.log("DELETE ALBUM ERROR:", error);
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "Deleted" });
}

module.exports = {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};
