const supabase = require("../config/supabase");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token với Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error("❌ Supabase auth error:", error);
      return res.status(401).json({ message: "Unauthorized", error: error?.message });
    }

    // Lưu user vào request (tương thích với format cũ)
    req.user = {
      uid: user.id,
      email: user.email,
      ...user
    };

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};
