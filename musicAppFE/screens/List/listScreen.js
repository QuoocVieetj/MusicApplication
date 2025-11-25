import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { fetchSongs } from "../../redux/slice/songSlice";

import PlayIcon from "../../assets/icons/play.svg";
import ListIcon from "../../assets/icons/list.svg";

const ListScreen = ({ onBack, onSongPress }) => {
  const dispatch = useDispatch();
  const { list: songs, status, error } = useSelector((state) => state.songs);

  // LOAD SONGS KHI VÀO TRANG (nếu chưa có)
  useEffect(() => {
    if (songs.length === 0 || status === "idle") {
      dispatch(fetchSongs());
    }
  }, []);

  // convert durationMs → 2:30
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerIcon}>
            <ListIcon width={28} height={28} fill="#24F7BC" />
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreIcon}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {status === "loading" && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#24F7BC" />
          </View>
        )}

        {/* Error Message */}
        {status === "failed" && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ Không thể tải dữ liệu</Text>
            <Text style={styles.errorDetail}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => dispatch(fetchSongs())}
            >
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {status === "success" && songs.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có bài hát nào</Text>
          </View>
        )}

        {/* Song List */}
        {status === "success" && songs.length > 0 && (
          <View style={{ marginTop: 25 }}>
            {songs.map((song, index) => {
              // Có thể thêm logic để xác định bài hát đang phát
              const isActive = false; // Tạm thời để false, có thể update sau

              return (
                <TouchableOpacity
                  key={song.id}
                  onPress={() => onSongPress && onSongPress(song)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.songItem,
                      isActive && styles.activeSongItem,
                    ]}
                  >
                    {/* IMAGE */}
                    <Image
                      source={
                        song.imageUrl
                          ? { uri: song.imageUrl }
                          : require("../../assets/image/bgrLogin.jpg")
                      }
                      style={styles.songImage}
                    />

                    {/* TEXT AREA */}
                    <View style={styles.songTextArea}>
                      <Text
                        style={[
                          styles.songTitle,
                          isActive && styles.songTitleActive,
                        ]}
                        numberOfLines={1}
                      >
                        {song.title || "Không có tiêu đề"}
                      </Text>

                      <Text style={styles.songArtist} numberOfLines={1}>
                        {song.genreName || song.artistName || "Không rõ thể loại"}
                      </Text>

                      {song.durationMs && (
                        <Text style={styles.songDuration}>
                          {formatTime(song.durationMs)}
                        </Text>
                      )}
                    </View>

                    {/* PLAY BUTTON */}
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        onSongPress && onSongPress(song);
                      }}
                    >
                      <View
                        style={[
                          styles.playButton,
                          isActive && styles.playButtonActive,
                        ]}
                      >
                        <PlayIcon width={32} height={32} fill="#fff" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

      </ScrollView>
    </View>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1218",
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: { padding: 5 },

  backArrow: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
  },

  headerIcon: {
    backgroundColor: "#1C1F26",
    padding: 10,
    borderRadius: 50,
  },

  moreButton: { padding: 5 },

  moreIcon: {
    color: "#fff",
    fontSize: 32,
    marginBottom: 4,
  },

  /* --- SONG ITEM --- */
  songItem: {
    backgroundColor: "#1C1F26",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  activeSongItem: {
    backgroundColor: "#242A34",
    borderColor: "#24F7BC33",
  },

  /* SONG IMAGE */
  songImage: {
    width: 55,
    height: 55,
    borderRadius: 12,
    marginRight: 15,
  },

  songTextArea: {
    flex: 1,
  },

  songTitle: {
    color: "#E8E8E8",
    fontSize: 16,
    fontWeight: "700",
  },

  songTitleActive: {
    color: "#24F7BC",
  },

  songArtist: {
    color: "#9AA0A6",
    fontSize: 12,
    marginTop: 4,
  },

  playButton: {
    width: 50,
    height: 50,
    backgroundColor: "#2F343D",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  playButtonActive: {
    backgroundColor: "#24F7BC",
  },

  songDuration: {
    color: "#666",
    fontSize: 11,
    marginTop: 2,
  },

  loadingContainer: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  errorContainer: {
    marginTop: 50,
    padding: 20,
    backgroundColor: "#1C1F26",
    borderRadius: 15,
    alignItems: "center",
  },

  errorText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  errorDetail: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: "#24F7BC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryText: {
    color: "#000",
    fontWeight: "600",
  },

  emptyContainer: {
    marginTop: 50,
    padding: 20,
    alignItems: "center",
  },

  emptyText: {
    color: "#777",
    fontSize: 14,
  },
});
