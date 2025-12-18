const supabase = require("../config/supabaseAdmin");

exports.getRecentSongs = async (req, res) => {
    const { data, error } = await supabase
        .from("recent")
        .select("songs(*)")
        .eq("user_id", req.user.uid)
        .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
};

exports.clearRecent = async (req, res) => {
    const { error } = await supabase
        .from("recent")
        .delete()
        .eq("user_id", req.user.uid);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Cleared" });
};
