const supabase = require("../config/supabase");

/* ================= GET ALL USERS ================= */
async function getAllUsers(req, res) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("GET USERS ERROR:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
}

/* ================= GET USER BY ID ================= */
async function getUserById(req, res) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "User not found" });

  res.json(data);
}

/* ================= CREATE USER ================= */
async function createUser(req, res) {
  const { id, name, avatar, role } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: "id and name are required" });
  }

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        id: String(id).trim(),
        name,
        avatar: avatar || null,
        role: role || "user",
      },
    ])
    .select()
    .maybeSingle();

  if (error) {
    console.log("CREATE USER ERROR:", error);
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
}

/* ================= UPDATE USER ================= */
async function updateUser(req, res) {
  const { id } = req.params;
  const {
    name,
    avatar,
    role,
    liked_songs,
    recently_played,
    following_artists,
  } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (avatar !== undefined) updates.avatar = avatar || null;
  if (role !== undefined) updates.role = role;
  if (liked_songs !== undefined) updates.liked_songs = liked_songs;
  if (recently_played !== undefined)
    updates.recently_played = recently_played;
  if (following_artists !== undefined)
    updates.following_artists = following_artists;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", String(id).trim())
    .select();

  if (error) {
    console.log("UPDATE USER ERROR:", error);
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(data[0]);
}

/* ================= DELETE USER ================= */
async function deleteUser(req, res) {
  const { id } = req.params;

  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", String(id).trim());

  if (error) {
    console.log("DELETE USER ERROR:", error);
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "Deleted" });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
