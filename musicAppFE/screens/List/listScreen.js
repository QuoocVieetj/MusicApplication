import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import PlayIcon from "../../assets/icons/play.svg";
import ListIcon from "../../assets/icons/list.svg";

const ListScreen = ({ onBack }) => {
  const songs = [
    { name: "Dailamo Dailamo", artist: "Sangeetha Rajeshwaran, Vijay Annoty" },
    { name: "Saara Kaattre", artist: "S.P. Balasubrahmanyam" },
    { name: "Marundhaani", artist: "Nakash Aziz , Anthony Daasan" },
    { name: "Oru Devadhai", artist: "Roopkumar Rathod", active: true },
    { name: "Marundhaani", artist: "Nakash Aziz , Anthony Daasan" },
    { name: "Marundhaani", artist: "Nakash Aziz , Anthony Daasan" },
    { name: "Marundhaani", artist: "Nakash Aziz , Anthony Daasan" },
  ];

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

        {/* Song List */}
        <View style={{ marginTop: 25 }}>
          {songs.map((item, index) => {
            const isActive = item.active;

            return (
              <View
                key={index}
                style={[
                  styles.songItem,
                  isActive && styles.activeSongItem,
                ]}
              >
                {/* IMAGE */}
                <Image
                  source={require("../../assets/image/bgrLogin.jpg")}
                  style={styles.songImage}
                />

                {/* TEXT AREA */}
                <View style={styles.songTextArea}>
                  <Text
                    style={[
                      styles.songTitle,
                      isActive && styles.songTitleActive,
                    ]}
                  >
                    {item.name}
                  </Text>

                  <Text style={styles.songArtist}>{item.artist}</Text>
                </View>

                {/* PLAY BUTTON */}
                <TouchableOpacity>
                  <View
                    style={[
                      styles.playButton,
                      isActive && styles.playButtonActive,
                    ]}
                  >
                    <PlayIcon width={14} height={14} fill="#fff" />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

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
    width: 36,
    height: 36,
    backgroundColor: "#2F343D",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  playButtonActive: {
    backgroundColor: "#24F7BC",
  },
});
