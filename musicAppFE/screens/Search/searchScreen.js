import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchSongs, setSearchQuery } from "../../redux/slice/songSlice";

import SearchIcon from "../../assets/icons/search.svg";

// Helper: bỏ dấu + lowercase
const normalizeText = (text) =>
  (text || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const SearchScreen = ({ onBack, onSongPress }) => {
  const dispatch = useDispatch();
  const { list: songs, status, error, searchQuery } = useSelector(
    (state) => state.songs
  );

  // Load songs nếu chưa có
  useEffect(() => {
    if (!songs || songs.length === 0) {
      dispatch(fetchSongs());
    }
  }, []);

  const q = normalizeText(searchQuery || "").trim();

  const filtered =
    !q || !songs
      ? songs || []
      : songs.filter((song) => {
          const title = normalizeText(song.title || "");
          const artist = normalizeText(song.artistName || "");
          const genre = normalizeText(song.genreName || "");
          return (
            title.includes(q) || artist.includes(q) || genre.includes(q)
          );
        });

  return (
    <View style={styles.container}>
      {/* SEARCH BAR + BACK */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <SearchIcon width={18} height={18} fill="#777" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm bài hát, nghệ sĩ, album..."
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={(text) => dispatch(setSearchQuery(text))}
            autoFocus
          />
        </View>
      </View>

      {/* LOADING */}
      {status === "loading" && (
        <ActivityIndicator
          size="large"
          color="#24F7BC"
          style={{ marginTop: 24 }}
        />
      )}

      {/* ERROR */}
      {status === "failed" && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không thể tải dữ liệu</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      )}

      {/* RESULTS LIST */}
      <ScrollView
        style={{ marginTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((song) => (
          <TouchableOpacity
            key={song.id}
            activeOpacity={0.8}
            onPress={() => onSongPress && onSongPress(song)}
          >
            <View style={styles.item}>
              <Image
                source={
                  song.imageUrl
                    ? { uri: song.imageUrl }
                    : require("../../assets/image/bgrLogin.jpg")
                }
                style={styles.itemImage}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {song.title || "Không có tiêu đề"}
                </Text>
                <Text style={styles.itemSubtitle} numberOfLines={1}>
                  {song.artistName || song.genreName || "Không rõ nghệ sĩ"}
                </Text>
              </View>

              <Text style={styles.itemArrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}

        {status === "success" && filtered.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy kết quả phù hợp</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1218",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingRight: 8,
    paddingVertical: 4,
  },
  backIcon: {
    color: "#fff",
    fontSize: 24,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1F26",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#fff",
    fontSize: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "#1C1F26",
    marginBottom: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 14,
  },
  itemTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  itemSubtitle: {
    color: "#9AA0A6",
    fontSize: 12,
    marginTop: 4,
  },
  itemArrow: {
    color: "#fff",
    fontSize: 22,
    marginLeft: 8,
  },
  errorContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#1C1F26",
    borderRadius: 12,
  },
  errorText: {
    color: "#ff4444",
    fontWeight: "600",
    marginBottom: 4,
  },
  errorDetail: {
    color: "#aaa",
    fontSize: 12,
  },
  emptyContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#777",
    fontSize: 14,
  },
});


