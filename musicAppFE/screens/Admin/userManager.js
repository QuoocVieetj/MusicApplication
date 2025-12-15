import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  deleteUser,
  updateUser,
} from "../../redux/slice/userSlice";

const roles = ["user", "artist", "admin"]; // Thêm artist

const UserManager = () => {
  const dispatch = useDispatch();
  const { list: users, status } = useSelector((s) => s.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  // Chọn role trực tiếp
  const selectRole = (user) => {
    Alert.alert(
      "Chọn role",
      "",
      roles.map((role) => ({
        text: role.charAt(0).toUpperCase() + role.slice(1),
        onPress: () =>
          dispatch(
            updateUser({
              id: user.id,
              data: { role },
            })
          ),
      }))
    );
  };

  const confirmDelete = (user) => {
    Alert.alert(
      "Xoá user",
      `Xoá user "${user.name}"?`,
      [
        { text: "Huỷ" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: () => dispatch(deleteUser(user.id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(u, i) => u.id || `user-${i}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={
                item.avatar
                  ? { uri: item.avatar }
                  : require("../../assets/image/bgrLogin.jpg")
              }
              style={styles.avatar}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>Role: {item.role}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => selectRole(item)} // Mở Alert chọn role
                >
                  <Text style={styles.btnText}>Đổi role</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, styles.danger]}
                  onPress={() => confirmDelete(item)}
                >
                  <Text style={styles.btnText}>Xoá</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default UserManager;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0F1218" },
  card: {
    flexDirection: "row",
    backgroundColor: "#151922",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  name: { color: "#fff", fontWeight: "700" },
  role: { color: "#aaa", fontSize: 12 },
  actions: { flexDirection: "row", marginTop: 8 },
  btn: {
    backgroundColor: "#2A2F3A",
    padding: 6,
    borderRadius: 6,
    marginRight: 6,
  },
  danger: { backgroundColor: "#E74C3C" },
  btnText: { color: "#fff", fontSize: 12 },
});
