import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSongs,
  setSearchQuery,
  addSong,
  updateSong,
  deleteSong,
} from "../../redux/slice/songSlice";

/* ================= FORM ================= */
const SongForm = ({ song, onSave, onCancel }) => {
  const [title, setTitle] = useState(song?.title || "");
  const [artistId, setArtistId] = useState(song?.artist_id || "");
  const [albumId, setAlbumId] = useState(song?.album_id || "");
  const [genreId, setGenreId] = useState(song?.genre_id || "");
  const [imageUrl, setImageUrl] = useState(song?.image_url || "");
  const [audioUrl, setAudioUrl] = useState(song?.audio_url || "");

  return (
    <View style={styles.formOverlay}>
      <View style={styles.form}>
        <Text style={styles.formTitle}>
          {song ? "🎵 Sửa bài hát" : "➕ Thêm bài hát"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Tên bài hát"
          placeholderTextColor="#777"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Artist ID"
          placeholderTextColor="#777"
          value={artistId}
          onChangeText={setArtistId}
        />

        <TextInput
          style={styles.input}
          placeholder="Album ID"
          placeholderTextColor="#777"
          value={albumId}
          onChangeText={setAlbumId}
        />

        <TextInput
          style={styles.input}
          placeholder="Genre ID"
          placeholderTextColor="#777"
          value={genreId}
          onChangeText={setGenreId}
        />

        <TextInput
          style={styles.input}
          placeholder="Image URL"
          placeholderTextColor="#777"
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        <TextInput
          style={styles.input}
          placeholder="Audio URL"
          placeholderTextColor="#777"
          value={audioUrl}
          onChangeText={setAudioUrl}
        />

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() =>
            onSave({
              title,
              artist_id: artistId || null,
              album_id: albumId || null,
              genre_id: genreId || null,
              image_url: imageUrl || null,
              audio_url: audioUrl || null,
            })
          }
        >
          <Text style={styles.saveText}>LƯU</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelText}>Huỷ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ================= MAIN ================= */
export default function MusicManager() {
  const dispatch = useDispatch();
  const { list, status, searchQuery } = useSelector((s) => s.songs);

  const [showForm, setShowForm] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchSongs());
  }, [status]);

  const filtered = list.filter((s) =>
    s.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* SEARCH */}
      <TextInput
        style={styles.search}
        placeholder="🔍 Tìm kiếm bài hát..."
        placeholderTextColor="#777"
        value={searchQuery}
        onChangeText={(t) => dispatch(setSearchQuery(t))}
      />

      {/* ADD */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          setSelectedSong(null);
          setShowForm(true);
        }}
      >
        <Text style={styles.addText}>＋ Thêm bài hát</Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: item.imageUrl || "https://i.imgur.com/8Km9tLL.png",
              }}
              resizeMode="cover"
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.artist}>
                Nghệ sĩ: {item.artist_id || "Nhiều nghệ sĩ"}
              </Text>

              <View style={styles.actions}>
                <Btn
                  label="Sửa"
                  onPress={() => {
                    setSelectedSong(item);
                    setShowForm(true);
                  }}
                />
                <Btn
                  label="Xoá"
                  danger
                  onPress={() =>
                    Alert.alert("Xoá bài hát", "Bạn chắc chắn muốn xoá?", [
                      { text: "Huỷ" },
                      {
                        text: "Xoá",
                        style: "destructive",
                        onPress: () => dispatch(deleteSong(item.id)),
                      },
                    ])
                  }
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          status === "success" && (
            <Text style={styles.empty}>Không có bài hát</Text>
          )
        }
      />

      {showForm && (
        <SongForm
          song={selectedSong}
          onSave={(data) => {
            selectedSong
              ? dispatch(updateSong({ id: selectedSong.id, data }))
              : dispatch(addSong(data));
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </View>
  );
}

/* ================= BUTTON ================= */
const Btn = ({ label, danger, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.btn, danger && styles.danger]}
  >
    <Text style={styles.btnText}>{label}</Text>
  </TouchableOpacity>
);

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0F1218",
  },

  search: {
    backgroundColor: "#1B1F2A",
    color: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 14,
  },

  addBtn: {
    backgroundColor: "#24F7BC",
    paddingVertical: 14,
    borderRadius: 14,
    marginVertical: 14,
    shadowColor: "#24F7BC",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  addText: {
    fontWeight: "900",
    textAlign: "center",
    fontSize: 14,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#151922",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    elevation: 5,
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#222",
  },

  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
  },

  btn: {
    backgroundColor: "#2A2F3A",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 8,
  },

  danger: {
    backgroundColor: "#E74C3C",
  },

  btnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  empty: {
    color: "#777",
    textAlign: "center",
    marginTop: 40,
  },

  /* ===== FORM ===== */
  formOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },

  form: {
    backgroundColor: "#151922",
    borderRadius: 20,
    padding: 20,
  },

  formTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#1B1F2A",
    color: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  saveBtn: {
    backgroundColor: "#24F7BC",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  saveText: {
    fontWeight: "900",
  },

  cancelText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 14,
  },
    artist: { color: "#9AA0A6", fontSize: 12 },

});
