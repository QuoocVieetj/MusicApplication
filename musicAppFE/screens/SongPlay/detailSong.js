import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import { useSelector } from "react-redux";

import PlayIcon from "../../assets/icons/play.svg";
import HeartIcon from "../../assets/icons/heart.svg";
import NextIcon from "../../assets/icons/next.svg";
import PrevIcon from "../../assets/icons/prev.svg";

const { width, height } = Dimensions.get("window");

// Pause Icon Component
const PauseIcon = ({ width, height, fill }) => (
  <View style={{ width, height, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6 }}>
    <View style={{ width: 4, height: height * 0.6, backgroundColor: fill, borderRadius: 2 }} />
    <View style={{ width: 4, height: height * 0.6, backgroundColor: fill, borderRadius: 2 }} />
  </View>
);

const DetailSong = ({ onBack, song, onChangeSong }) => {
  const scrollRef = useRef(null);
  const [page, setPage] = useState(0);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const songs = useSelector((state) => state.songs.list || []);

  // Format time từ milliseconds
  const formatTime = (ms) => {
    if (!ms) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // Lyrics - xử lý cả string và object
  const getLyrics = () => {
    if (!song?.lyrics) return "Chưa có lời bài hát";
    if (typeof song.lyrics === "string") return song.lyrics;
    if (song.lyrics.plain) return song.lyrics.plain;
    if (song.lyrics.synced) return song.lyrics.synced;
    return "Chưa có lời bài hát";
  };
  const lyrics = getLyrics();

  // Load và setup audio
  useEffect(() => {
    if (!song?.audioUrl) return;

    const loadAudio = async () => {
      try {
        // Unload sound cũ nếu có
        if (sound) {
          await sound.unloadAsync();
        }

        // Cấu hình audio mode
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        // Load audio mới
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: song.audioUrl },
          { shouldPlay: false }
        );

        // Lấy duration
        const status = await newSound.getStatusAsync();
        if (status.isLoaded) {
          setDuration(status.durationMillis || 0);
        }

        // Listen to playback status
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setCurrentTime(status.positionMillis || 0);
            setIsPlaying(status.isPlaying);
            setDuration(status.durationMillis || status.durationMillis || 0);
            
            // Tự động dừng khi hết bài
            if (status.didJustFinish) {
              setIsPlaying(false);
              setCurrentTime(0);
            }
          }
        });

        setSound(newSound);
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadAudio();

    // Cleanup khi unmount hoặc song thay đổi
    return () => {
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [song?.audioUrl]);

  // Play/Pause handler
  const handlePlayPause = async () => {
    if (!sound) {
      // Nếu chưa có sound và có audioUrl, thử load lại
      if (song?.audioUrl) {
        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
          });
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: song.audioUrl },
            { shouldPlay: true }
          );
          setSound(newSound);
          setIsPlaying(true);
        } catch (error) {
          console.error("Error loading audio:", error);
        }
      }
      return;
    }

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Error playing/pausing:", error);
    }
  };

  // Chọn bài hát ngẫu nhiên khác bài hiện tại
  const pickRandomSong = () => {
    if (!songs || songs.length === 0 || !song) return null;
    if (songs.length === 1) return song;

    const currentIndex = songs.findIndex((s) => s.id === song.id);
    let newIndex = currentIndex;

    // Lặp cho đến khi chọn được index khác
    while (newIndex === currentIndex || newIndex === -1) {
      newIndex = Math.floor(Math.random() * songs.length);
    }

    return songs[newIndex];
  };

  const handleNextSong = () => {
    const next = pickRandomSong();
    if (next && onChangeSong) {
      onChangeSong(next);
    }
  };

  const handlePrevSong = () => {
    const prev = pickRandomSong();
    if (prev && onChangeSong) {
      onChangeSong(prev);
    }
  };

  // Fallback nếu không có song data
  if (!song) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Playing Now</Text>
          <HeartIcon width={26} height={26} fill="#24F7BC" />
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#fff" }}>Không có thông tin bài hát</Text>
          <TouchableOpacity onPress={onBack} style={{ marginTop: 20, padding: 10 }}>
            <Text style={{ color: "#24F7BC" }}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Playing Now</Text>

        <HeartIcon width={26} height={26} fill="#24F7BC" />
      </View>

      {/* SWIPER */}
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setPage(index);
        }}
        scrollEventThrottle={16}
        style={{ flexGrow: 0 }}
      >

        {/* IMAGE PAGE */}
        <View style={styles.page}>
          <View style={styles.imageWrapper}>
            <Image
              source={
                song.imageUrl
                  ? { uri: song.imageUrl }
                  : require("../../assets/image/bgrLogin.jpg")
              }
              style={styles.songImage}
            />
          </View>
        </View>

        {/* LYRICS PAGE */}
        <View style={styles.page}>
          <View style={styles.lyricsContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.lyricsText}>{lyrics}</Text>
            </ScrollView>
          </View>
        </View>

      </ScrollView>

      {/* DOTS */}
      <View style={styles.dotContainer}>
        <View style={[styles.dot, page === 0 && styles.dotActive]} />
        <View style={[styles.dot, page === 1 && styles.dotActive]} />
      </View>

      {/* SONG INFO */}
      <View style={styles.songInfo}>
        <View style={{ flex: 1 }}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {song.title || "Không có tiêu đề"}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {song.genreName || song.artistName || "Không rõ nghệ sĩ"}
          </Text>
        </View>
      </View>

      {/* SLIDER */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack} />
        <View
          style={[
            styles.sliderProgress,
            {
              width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
            },
          ]}
        />
      </View>

      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.timeText}>
          {formatTime(duration || song.durationMs)}
        </Text>
      </View>

      {/* CONTROLS */}
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.sideButton} onPress={handlePrevSong}>
          <PrevIcon width={30} height={30} fill="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          {isPlaying ? (
            <PauseIcon width={38} height={38} fill="#0F1218" />
          ) : (
            <PlayIcon width={38} height={38} fill="#0F1218" />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton} onPress={handleNextSong}>
          <NextIcon width={30} height={30} fill="#fff" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default DetailSong;

/* ====================== ★ STYLE SIÊU ĐẸP – HIỆN ĐẠI ★ ====================== */

const IMAGE_HEIGHT = height * 0.45;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1218",
    paddingTop: 55,
  },

  /* HEADER */
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    alignItems: "center",
    marginBottom: 5,
  },
  backIcon: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  /* PAGE */
  page: {
    width,
    height: IMAGE_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  /* IMAGE */
  imageWrapper: {
    width: width * 0.84,
    height: width * 0.84,
    borderRadius: 25,
    overflow: "hidden",

    shadowColor: "#24F7BC",
    shadowOpacity: 0.35,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 15 },
  },
  songImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  /* LYRICS */
  lyricsContainer: {
    width: width * 0.84,
    height: width * 0.84,
    backgroundColor: "#151922",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  lyricsText: {
    color: "#e0e0e0",
    textAlign: "center",
    lineHeight: 26,
    fontSize: 16,
  },

  /* DOTS */
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#555",
    borderRadius: 50,
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: "#24F7BC",
  },

  /* SONG INFO */
  songInfo: {
    marginTop: 20,
    flexDirection: "row",
    paddingHorizontal: 25,
  },
  songTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  songArtist: {
    color: "#9aa5b1",
    marginTop: 4,
    fontSize: 14,
  },

  /* SLIDER */
  sliderContainer: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
    position: "relative",
    height: 5,
  },
  sliderTrack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: "#333",
    borderRadius: 10,
  },
  sliderProgress: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 5,
    backgroundColor: "#24F7BC",
    borderRadius: 10,
  },

  /* TIME TEXT */
  timeRow: {
    width: "90%",
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  timeText: {
    color: "#aaa",
    fontSize: 13,
  },

  /* CONTROLS */
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    paddingHorizontal: 60,
    alignItems: "center",
  },

  sideButton: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 50,
  },

  playButton: {
    backgroundColor: "#24F7BC",
    padding: 28,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#24F7BC",
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
  },
});
