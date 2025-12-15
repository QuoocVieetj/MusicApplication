import React, { useEffect, useMemo, useState } from "react";
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
import { fetchAlbums } from "../../redux/slice/albumSlice";
import supabase from "../../supabaseClient";

import SearchIcon from "../../assets/icons/search.svg";
import PlayIcon from "../../assets/icons/play.svg";

const HomeScreen = ({ onNavigateToList, onSongPress, onNavigateToSearch }) => {
  const dispatch = useDispatch();

  const { list: songs, status } = useSelector((state) => state.songs);
  const { list: albums, status: albumsStatus } = useSelector(
    (state) => state.albums
  );

  const [displayName, setDisplayName] = useState("User");

  /* ================= USER INFO ================= */
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.user_metadata?.display_name) {
        setDisplayName(user.user_metadata.display_name);
      } else if (user?.email) {
        setDisplayName(user.email.split("@")[0]);
      }
    };
    getUser();
  }, []);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    dispatch(fetchSongs());
    dispatch(fetchAlbums());
  }, []);

  /* ================= MAP ALBUM ================= */
  const albumMap = useMemo(() => {
    const map = {};
    (albums || []).forEach((a) => {
      if (a?.id) map[a.id] = a;
    });
    return map;
  }, [albums]);

  /* ================= FORMAT TIME ================= */
  const formatTime = (ms) => {
    if (!ms) return "0:00";
    const total = Math.floor(ms / 1000);
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <Text style={styles.helloText}>Xin chào {displayName},</Text>
        <Text style={styles.subText}>Hôm nay bạn muốn nghe gì?</Text>

        {/* SEARCH */}
        <TouchableOpacity
          style={styles.searchContainer}
          activeOpacity={0.9}
          onPress={onNavigateToSearch}
        >
          <SearchIcon width={20} height={20} fill="#777" />
          <Text style={[styles.searchInput, { color: "#777" }]}>
            Tìm kiếm bài hát, nghệ sĩ, album...
          </Text>
        </TouchableOpacity>

        {/* ALBUMS */}
        {albumsStatus === "loading" && (
          <ActivityIndicator
            size="small"
            color="#24F7BC"
            style={{ marginBottom: 25 }}
          />
        )}

        {albumsStatus === "success" && albums.length > 0 && (
          <View style={styles.cardRow}>
            {albums.slice(0, 6).map((album, index) => (
              <View
                key={album?.id || `album-${index}`}
                style={styles.card}
              >
                <Image
                  source={
                    album.cover_url
                      ? { uri: album.cover_url }
                      : require("../../assets/image/bgrLogin.jpg")
                  }
                  style={styles.cardImage}
                />
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {album.title || "Không có tiêu đề"}
                </Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>
                  {album.artist_id || "Nhiều nghệ sĩ"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* RECENT HEADER */}
        <View style={styles.recentHeaderRow}>
          <Text style={styles.recentHeader}>Phát gần đây</Text>
          <TouchableOpacity onPress={onNavigateToList}>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {/* SONGS LOADING */}
        {status === "loading" && (
          <ActivityIndicator
            size="large"
            color="#24F7BC"
            style={{ marginTop: 20 }}
          />
        )}

        {/* SONG LIST */}
        {status === "success" &&
          songs.map((song, index) => (
            <TouchableOpacity
              key={song?.id || `song-${index}`}
              onPress={() => onSongPress && onSongPress(song)}
              activeOpacity={0.7}
            >
              <View style={styles.recentItem}>
                <Image
                  source={
                    song.imageUrl
                      ? { uri: song.imageUrl }
                      : require("../../assets/image/bgrLogin.jpg")
                  }
                  style={styles.recentImage}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.recentTitle}>
                    {song.title || "Không có tiêu đề"}
                  </Text>
                  <Text style={styles.recentArtist}>
                    {song.artist_id || "Không rõ nghệ sĩ"}
                  </Text>
                  <Text style={styles.recentTime}>
                    {formatTime(song.durationMs)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onSongPress && onSongPress(song);
                  }}
                >
                  <View style={styles.playButton}>
                    <PlayIcon width={32} height={32} fill="#fff" />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1218",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  helloText: { color: "#fff", fontSize: 22, fontWeight: "700" },
  subText: { color: "#999", fontSize: 14, marginBottom: 20 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1F26",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 22,
  },
  searchInput: { marginLeft: 10, flex: 1 },

  cardRow: { flexDirection: "row", gap: 15, marginBottom: 25 },
  card: {
    backgroundColor: "#1C1F26",
    borderRadius: 15,
    padding: 10,
    width: 150,
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: { color: "#fff", fontWeight: "700", fontSize: 15 },
  cardSubtitle: { color: "#bbb", fontSize: 12 },

  recentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  recentHeader: { color: "#fff", fontSize: 18, fontWeight: "700" },
  seeAll: { color: "#24F7BC", fontSize: 14 },

  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1F26",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
  },
  recentImage: { width: 60, height: 60, borderRadius: 10, marginRight: 15 },
  recentTitle: { color: "#fff", fontWeight: "700", fontSize: 15 },
  recentArtist: { color: "#aaa", fontSize: 12 },
  recentTime: { color: "#ccc", fontSize: 12, marginTop: 2 },

  playButton: {
    width: 48,
    height: 48,
    backgroundColor: "#24F7BC",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
