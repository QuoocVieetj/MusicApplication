import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MusicManager from "./musicManager";
import AlbumManager from "./albumManager";
import UserManager from "./userManager";

const AdminScreen = ({ onBack }) => {
  const [tab, setTab] = useState("music");

  const renderTab = () => {
    if (tab === "music") return <MusicManager />;
    if (tab === "album") return <AlbumManager />;
    if (tab === "user") return <UserManager />;
    return null;
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ADMIN PANEL</Text>
      </View>

      {/* TAB BAR */}
      <View style={styles.tabs}>
        <Tab label="Nhạc" active={tab === "music"} onPress={() => setTab("music")} />
        <Tab label="Album" active={tab === "album"} onPress={() => setTab("album")} />
        <Tab label="User" active={tab === "user"} onPress={() => setTab("user")} />
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1 }}>{renderTab()}</View>
    </View>
  );
};

const Tab = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tab, active && styles.activeTab]}
  >
    <Text style={styles.tabText}>{label}</Text>
  </TouchableOpacity>
);

export default AdminScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1218", paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  back: { color: "#fff", fontSize: 26, marginRight: 10 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700" },
  tabs: { flexDirection: "row", justifyContent: "space-around" },
  tab: { paddingVertical: 10 },
  activeTab: { borderBottomWidth: 2, borderColor: "#24F7BC" },
  tabText: { color: "#fff" },
});
