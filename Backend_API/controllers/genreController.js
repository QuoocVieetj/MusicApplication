const supabase = require("../config/supabaseAdmin");

exports.getGenres = async (req, res) => {
    const { data, error } = await supabase.from("genres").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
};
