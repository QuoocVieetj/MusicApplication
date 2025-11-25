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
import { fetchSongs } from "../../redux/slice/songSlice";

import SearchIcon from "../../assets/icons/search.svg";
import PlayIcon from "../../assets/icons/play.svg";

const HomeScreen = ({ onNavigateToList }) => {
  const dispatch = useDispatch();
  const { list: songs, status } = useSelector((state) => state.songs);

  // LOAD SONGS KHI VÀO TRANG
  useEffect(() => {
    dispatch(fetchSongs());
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
        
        {/* HEADER */}
        <Text style={styles.helloText}>Xin chào Vini,</Text>
        <Text style={styles.subText}>Hôm nay bạn muốn nghe gì?</Text>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <SearchIcon width={20} height={20} fill="#777" />
          <TextInput
            placeholder="Tìm kiếm bài hát, nghệ sĩ..."
            placeholderTextColor="#777"
            style={styles.searchInput}
          />
        </View>

        {/* TAB */}
        <View style={styles.tabRow}>
          <View style={styles.tabItem}>
            <Text style={[styles.tabText, styles.tabActive]}>Gợi ý</Text>
            <View style={styles.tabUnderline} />
          </View>

          <Text style={styles.tabText}>Thịnh hành</Text>
          <Text style={styles.tabText}>Làm đẹp</Text>
          <Text style={styles.tabText}>Kinh doanh</Text>
        </View>

        {/* STATIC CARDS */}
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Image
              source={require("../../assets/image/bgrLogin.jpg")}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>Tiệc thứ sáu</Text>
            <Text style={styles.cardSubtitle}>Tâm trạng bùng nổ!</Text>
          </View>

          <View style={styles.card}>
            <Image
              source={require("../../assets/image/bgrLogin.jpg")}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>Tiệc thứ bảy</Text>
            <Text style={styles.cardSubtitle}>Tâm trạng tiệc tùng!</Text>
          </View>
        </View>

        {/* RECENT */}
        <View style={styles.recentHeaderRow}>
          <Text style={styles.recentHeader}>Phát gần đây</Text>
          <TouchableOpacity onPress={onNavigateToList}>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {/* LOADING */}
        {status === "loading" && (
          <ActivityIndicator
            size="large"
            color="#24F7BC"
            style={{ marginTop: 20 }}
          />
        )}

        {/* SONG LIST */}
        {songs.map((song) => (
          <View key={song.id} style={styles.recentItem}>
            {/* IMAGE */}
            <Image
              source={{ uri: song.imageUrl }}
              style={styles.recentImage}
            />

            {/* INFO */}
            <View style={{ flex: 1 }}>
              <Text style={styles.recentTitle}>{song.title}</Text>

              <Text style={styles.recentArtist}>
                {song.genreName || "Không rõ thể loại"}
              </Text>

              <Text style={styles.recentTime}>
                {formatTime(song.durationMs)}
              </Text>
            </View>

            {/* PLAY BUTTON */}
            <View style={styles.playButton}>
              <PlayIcon width={14} height={14} fill="#fff" />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

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
  searchInput: { color: "#fff", marginLeft: 10, flex: 1 },
  tabRow: { flexDirection: "row", marginBottom: 20, gap: 25 },
  tabItem: { alignItems: "center" },
  tabText: { color: "#777", fontSize: 14 },
  tabActive: { color: "#24F7BC", fontWeight: "600" },
  tabUnderline: {
    height: 3,
    width: 25,
    backgroundColor: "#24F7BC",
    borderRadius: 10,
    marginTop: 4,
  },
  cardRow: { flexDirection: "row", gap: 15, marginBottom: 25 },
  card: {
    backgroundColor: "#1C1F26",
    borderRadius: 15,
    padding: 10,
    width: 150,
  },
  cardImage: { width: "100%", height: 100, borderRadius: 12, marginBottom: 12 },
  cardTitle: { color: "#fff", fontWeight: "700", fontSize: 15 },
  cardSubtitle: { color: "#bbb", fontSize: 12, marginTop: 3 },
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
  recentArtist: { color: "#aaa", fontSize: 12, marginTop: 3 },
  recentTime: { color: "#ccc", fontSize: 12, marginTop: 2 },
  playButton: {
    width: 34,
    height: 34,
    backgroundColor: "#24F7BC",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
