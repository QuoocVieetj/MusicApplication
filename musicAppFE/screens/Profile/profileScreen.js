import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import supabase from "../../supabaseClient";

const ProfileScreen = ({ onNavigateToAdmin }) => {
  const [displayName, setDisplayName] = useState("Người dùng");
  const [email, setEmail] = useState("Chưa cập nhật");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setDisplayName(
          user.user_metadata?.display_name ||
            user.email?.split("@")[0] ||
            "Người dùng"
        );
        setEmail(user.email || "Chưa cập nhật");
      }
    };

    getUser();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AVATAR + NAME */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require("../../assets/image/bgrLogin.jpg")}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.nameText}>{displayName}</Text>
        </View>

        {/* PERSONAL INFORMATION */}
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <TouchableOpacity style={styles.row}>
          <View>
            <Text style={styles.rowLabel}>Name</Text>
            <Text style={styles.rowValue}>{displayName}</Text>
          </View>
          <Text style={styles.rowArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <View>
            <Text style={styles.rowLabel}>Email</Text>
            <Text style={styles.rowValue}>{email}</Text>
          </View>
          <Text style={styles.rowArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <View>
            <Text style={styles.rowLabel}>Language</Text>
            <Text style={styles.rowValue}>Tiếng Việt</Text>
          </View>
          <Text style={styles.rowArrow}>›</Text>
        </TouchableOpacity>

        {/* ABOUT */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>About</Text>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Privacy</Text>
          <Text style={styles.rowArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Storage</Text>
          <Text style={styles.rowArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Audio Quality</Text>
          <Text style={styles.rowArrow}>›</Text>
        </TouchableOpacity>

        {/* ===== ADMIN BUTTON (CHỈ THÊM DÒNG NÀY) ===== */}
        <TouchableOpacity
          style={styles.row}
          onPress={onNavigateToAdmin}
        >
          <Text style={[styles.rowLabel, { color: "#24F7BC" }]}>
            Admin Panel
          </Text>
          <Text style={[styles.rowArrow, { color: "#24F7BC" }]}>
            ›
          </Text>
        </TouchableOpacity>
        {/* ========================================= */}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1218",
    paddingTop: 50,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#24F7BC",
    marginBottom: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  nameText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#9AA0A6",
    fontSize: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#22252C",
  },
  rowLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 3,
  },
  rowValue: {
    color: "#9AA0A6",
    fontSize: 13,
  },
  rowArrow: {
    color: "#9AA0A6",
    fontSize: 18,
  },
});

