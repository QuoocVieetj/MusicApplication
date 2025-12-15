const supabase = require("../config/supabase");

// Lấy tất cả comments
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false }); // sắp xếp mới nhất lên đầu

    if (error) throw error;
    res.json(data || []);
  } catch (e) {
    console.error("Error fetching comments:", e.message);
    res.status(500).json({ message: "Error fetching comments", error: e.message });
  }
};

// Tạo comment mới
exports.create = async (req, res) => {
  try {
    const commentData = {
      ...req.body,
      created_at: new Date().toISOString() // lưu đúng tên cột
    };

    const { data, error } = await supabase
      .from("comments")
      .insert([commentData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    console.error("Error creating comment:", e.message);
    res.status(500).json({ message: "Failed to create comment", error: e.message });
  }
};

// Xóa comment theo id
exports.delete = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("id", req.params.id)
      .select()
      .single(); // trả về bản ghi bị xóa

    if (error) throw error;

    res.json({ message: "Comment deleted", data });
  } catch (e) {
    console.error("Error deleting comment:", e.message);
    res.status(500).json({ message: "Failed to delete comment", error: e.message });
  }
};
