import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";


// mk Demo@gmail.com
// tk 123456
const bgImage = require("../../assets/image/bgrLogin.jpg");

const GradientButton = ({ title, onPress, loading }) => (
  <LinearGradient
    colors={["#24F7BC", "#24C4FC"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.gradientButton}
  >
    <TouchableOpacity
      style={styles.gradientButtonInner}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#0F1B2E" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  </LinearGradient>
);

const LoginScreen = ({ onNavigateToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      setLoading(true);

      // LOGIN với Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);

      Alert.alert("Thành công", "Đăng nhập thành công!");
      onLoginSuccess && onLoginSuccess();   // CHUYỂN VỀ HOME

    } catch (error) {
      console.log("❌ Login error:", error);

      if (error.code === "auth/user-not-found") {
        Alert.alert("Lỗi", "Không tìm thấy tài khoản");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Lỗi", "Sai mật khẩu");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Lỗi", "Email không hợp lệ");
      } else {
        Alert.alert("Lỗi", "Đăng nhập thất bại");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={bgImage} resizeMode="cover" style={styles.bg}>
      <SafeAreaView style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          
          <LinearGradient
            colors={["#24F7BC", "#24C4FC"]}
            style={styles.logoGradient}
          >
            <Text style={styles.logoIcon}>♫</Text>
          </LinearGradient>

          <Text style={styles.logoText}>Vii Music</Text>
          <Text style={styles.headerText}>Đăng nhập vào tài khoản của bạn</Text>

          <CustomInput
            label="Địa chỉ Email"
            placeholder="spotify@gmail.com"
            value={email}
            onChangeText={setEmail}
          />

          <CustomInput
            label="Mật khẩu"
            placeholder="************"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <GradientButton title="Đăng nhập" onPress={loginUser} loading={loading} />

          <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>Hoặc</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={onNavigateToRegister}>
              <Text style={styles.footerLink}> Đăng ký</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const CustomInput = ({
  label,
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#ccc"
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

export default LoginScreen;

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },
  container: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    alignItems: "center",
  },

  logoGradient: {
    width: 75,
    height: 75,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  logoIcon: { fontSize: 38, color: "#fff", fontWeight: "900" },
  logoText: { fontSize: 28, fontWeight: "700", color: "#E8D1FF", marginBottom: 20 },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 25,
  },

  inputContainer: { width: "100%", marginBottom: 20 },
  inputLabel: { fontSize: 15, color: "#f2f2f2", marginBottom: 6 },
  input: {
    width: "100%",
    height: 52,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },

  gradientButton: {
    width: "100%",
    height: 55,
    borderRadius: 15,
    marginBottom: 25,
  },
  gradientButtonInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#0F1B2E",
    fontSize: 18,
    fontWeight: "700",
  },

  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },

  line: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.28)" },
  separatorText: { marginHorizontal: 15, color: "rgba(255,255,255,0.65)" },

  footerRow: { flexDirection: "row" },
  footerText: { color: "#fff", fontSize: 16 },
  footerLink: { color: "#24C4FC", fontSize: 16, fontWeight: "bold" },
});
