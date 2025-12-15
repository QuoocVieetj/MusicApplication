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
  fetchAlbums,
  addAlbum,
  updateAlbum,
  deleteAlbum,
} from "../../redux/slice/albumSlice";

/* ================= FORM ================= */
const AlbumForm = ({ album, onSave, onCancel }) => {
  const [id, setId] = useState(album?.id || "");
  const [title, setTitle] = useState(album?.title || "");
  const [artistId, setArtistId] = useState(album?.artist_id || "");
  const [coverUrl, setCoverUrl] = useState(album?.cover_url || "");

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>
        {album ? "Sửa Album" : "Thêm Album"}
      </Text>

      {!album && (
        <TextInput
          style={styles.input}
          placeholder="Album ID"
          placeholderTextColor="#777"
          value={id}
          onChangeText={setId}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Tên album"
        placeholderTextColor="#777"
        value={title}
        onChangeText={setTitle}
      />

      {/* <TextInput
        style={styles.input}
        placeholder="Artist ID (tuỳ chọn)"
        placeholderTextColor="#777"
        value={artistId}
        onChangeText={setArtistId}
      /> */}

      <TextInput
        style={styles.input}
        placeholder="Cover URL"
        placeholderTextColor="#777"
        value={coverUrl}
        onChangeText={setCoverUrl}
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => {
          if (!title.trim()) return alert("Chưa nhập tên album");
          if (!album && !id.trim()) return alert("Chưa nhập album id");

          onSave({
            id,
            title,
            artistId: artistId || null,
            coverUrl,
          });
        }}
      >
        <Text style={{ fontWeight: "800" }}>LƯU</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCancel}>
        <Text style={{ color: "#aaa", marginTop: 12 }}>Huỷ</Text>
      </TouchableOpacity>
    </View>
  );
};

/* ================= MAIN ================= */
const AlbumManager = () => {
  const dispatch = useDispatch();
  const { list: albums, status } = useSelector((state) => state.albums);

  const [showForm, setShowForm] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchAlbums());
  }, [status]);

  const handleSave = async (data) => {
    if (selectedAlbum) {
      await dispatch(
        updateAlbum({
          id: selectedAlbum.id,
          data,
        })
      );
    } else {
      await dispatch(addAlbum(data));
    }
    setShowForm(false);
  };

  const handleDelete = (album) => {
    Alert.alert(
      "Xoá album",
      `Bạn chắc chắn muốn xoá "${album.title}"?`,
      [
        { text: "Huỷ" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: () => dispatch(deleteAlbum(album.id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* ADD */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          setSelectedAlbum(null);
          setShowForm(true);
        }}
      >
        <Text style={styles.addText}>＋ Thêm album</Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri:
                  item.cover_url ||
                  "https://i.imgur.com/8Km9tLL.png",
              }}
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
                    setSelectedAlbum(item);
                    setShowForm(true);
                  }}
                />
                <Btn
                  label="Xoá"
                  danger
                  onPress={() => handleDelete(item)}
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          status === "success" && (
            <Text style={styles.empty}>Chưa có album</Text>
          )
        }
      />

      {showForm && (
        <AlbumForm
          album={selectedAlbum}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </View>
  );
};

/* ================= BUTTON ================= */
const Btn = ({ label, danger, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.btn, danger && styles.danger]}
  >
    <Text style={styles.btnText}>{label}</Text>
  </TouchableOpacity>
);

export default AlbumManager;

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0F1218" },

  addBtn: {
    backgroundColor: "#24F7BC",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  addText: { textAlign: "center", fontWeight: "800" },

  card: {
    flexDirection: "row",
    backgroundColor: "#151922",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },

  name: { color: "#fff", fontSize: 16, fontWeight: "700" },
  artist: { color: "#9AA0A6", fontSize: 12 },

  actions: { flexDirection: "row", marginTop: 6 },

  btn: {
    backgroundColor: "#2A2F3A",
    padding: 6,
    borderRadius: 6,
    marginRight: 6,
  },

  danger: { backgroundColor: "#E74C3C" },
  btnText: { color: "#fff", fontSize: 12 },

  empty: {
    color: "#777",
    textAlign: "center",
    marginTop: 40,
  },

  form: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#0F1218",
    padding: 20,
    justifyContent: "center",
  },

  formTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#1B1F2A",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: "#24F7BC",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
});
