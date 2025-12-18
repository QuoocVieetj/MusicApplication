const supabase = require("../config/supabaseAdmin");

exports.followArtist = async (req, res) => {
    const { error } = await supabase.from("follows").insert({
        user_id: req.user.uid,
        artist_id: req.params.artistId,
    });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Followed" });
};

exports.unfollowArtist = async (req, res) => {
    const { error } = await supabase
        .from("follows")
        .delete()
        .match({
            user_id: req.user.uid,
            artist_id: req.params.artistId,
        });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Unfollowed" });
};

exports.getFollowedArtists = async (req, res) => {
    const { data, error } = await supabase
        .from("follows")
        .select("artists(*)")
        .eq("user_id", req.user.uid);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
};
