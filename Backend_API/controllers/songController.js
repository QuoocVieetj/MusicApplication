const supabase = require('../config/supabase');

// Helper tạo signed URL
async function getSignedUrl(bucket, path) {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60); // 1 hour

  if (error) {
    console.log("Signed URL error:", error.message);
    return null;
  }

  return data.signedUrl;
}

async function getAllSongs(req, res) {
  const { data: songs, error } = await supabase
    .from("songs")
    .select("*");

  if (error) return res.status(500).json({ error: error.message });

  const mapped = await Promise.all(
    songs.map(async (song) => {
      const imageUrl = await getSignedUrl("covers", song.cover_path);
      const audioUrl = await getSignedUrl("songs", song.audio_path);

      return {
        ...song,
        imageUrl,
        audioUrl,
      };
    })
  );

  res.json(mapped);
}

async function getSongById(req, res) {
  const { id } = req.params;

  const { data: song, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: error.message });

  const imageUrl = await getSignedUrl("covers", song.cover_path);
  const audioUrl = await getSignedUrl("songs", song.audio_path);

  res.json({
    ...song,
    imageUrl,
    audioUrl,
  });
}

async function createSong(req, res) {
  const song = req.body;
  const { data, error } = await supabase.from("songs").insert([song]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
}

async function updateSong(req, res) {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from("songs")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
}

async function deleteSong(req, res) {
  const { id } = req.params;

  const { data, error } = await supabase.from("songs").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Song deleted", data });
}

// SEARCH SONGS - Tìm kiếm bài hát theo query
async function searchSongs(req, res) {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const searchTerm = q.trim();
    
    // Lấy tất cả songs
    const { data: songs, error } = await supabase
      .from("songs")
      .select("*")
      .limit(200); // Lấy nhiều hơn để filter ở backend

    if (error) {
      console.error("Search error:", error);
      return res.status(500).json({ error: error.message });
    }

    // Lấy artists, genres, albums riêng để map
    const artistIds = [...new Set((songs || []).map(s => s.artist_id).filter(Boolean))];
    const genreIds = [...new Set((songs || []).map(s => s.genre_id).filter(Boolean))];
    const albumIds = [...new Set((songs || []).map(s => s.album_id).filter(Boolean))];

    // Lấy artists, genres, albums riêng để map (xử lý lỗi)
    let artistMap = {};
    let genreMap = {};
    let albumMap = {};

    try {
      if (artistIds.length > 0) {
        const { data: artistsData, error: artistsError } = await supabase
          .from("artists")
          .select("id, name")
          .in("id", artistIds);
        if (!artistsError && artistsData) {
          artistsData.forEach(a => { artistMap[a.id] = a.name; });
        }
      }
    } catch (err) {
      console.error("Error fetching artists:", err);
    }

    try {
      if (genreIds.length > 0) {
        const { data: genresData, error: genresError } = await supabase
          .from("genres")
          .select("id, name")
          .in("id", genreIds);
        if (!genresError && genresData) {
          genresData.forEach(g => { genreMap[g.id] = g.name; });
        }
      }
    } catch (err) {
      console.error("Error fetching genres:", err);
    }

    try {
      if (albumIds.length > 0) {
        const { data: albumsData, error: albumsError } = await supabase
          .from("albums")
          .select("id, title")
          .in("id", albumIds);
        if (!albumsError && albumsData) {
          albumsData.forEach(a => { albumMap[a.id] = a.title; });
        }
      }
    } catch (err) {
      console.error("Error fetching albums:", err);
    }

    // Filter ở backend với case-insensitive search
    const normalizedQuery = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const filtered = (songs || []).filter((song) => {
      const title = (song.title || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const artistName = (artistMap[song.artist_id] || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const genreName = (genreMap[song.genre_id] || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const albumTitle = (albumMap[song.album_id] || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      return (
        title.includes(normalizedQuery) ||
        artistName.includes(normalizedQuery) ||
        genreName.includes(normalizedQuery) ||
        albumTitle.includes(normalizedQuery)
      );
    }).slice(0, 50); // Giới hạn 50 kết quả

    // Map songs với signed URLs
    const mapped = await Promise.all(
      filtered.map(async (song) => {
        const imageUrl = await getSignedUrl("covers", song.cover_path);
        const audioUrl = await getSignedUrl("songs", song.audio_path);

        return {
          ...song,
          imageUrl,
          audioUrl,
          // Đảm bảo có artistName và genreName
          artistName: artistMap[song.artist_id] || "",
          genreName: genreMap[song.genre_id] || "",
          albumTitle: albumMap[song.album_id] || "",
        };
      })
    );

    res.json(mapped);
  } catch (error) {
    console.error("Search songs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  searchSongs
};
