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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const bgImage = require("../../assets/image/bgrLogin.jpg");

// Nút Gradient
const GradientButton = ({ title, onPress }) => (
  <LinearGradient
    colors={["#24F7BC", "#24C4FC"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.gradientButton}
  >
    <TouchableOpacity style={styles.gradientButtonInner} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  </LinearGradient>
);

// Nút Google
const GoogleButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.googleButton} onPress={onPress}>
    <View style={styles.googleIconContainer}>
      <Text style={styles.googleIconText}>G</Text>
    </View>
    <Text style={styles.googleButtonText}>{title}</Text>
  </TouchableOpacity>
);

// Input
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

const LoginScreen = ({ onNavigateToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <ImageBackground source={bgImage} resizeMode="cover" style={styles.bg}>
      <SafeAreaView style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* LOGO */}
          <LinearGradient
            colors={["#24F7BC", "#24C4FC"]}
            style={styles.logoGradient}
          >
            <Text style={styles.logoIcon}>♫</Text>
          </LinearGradient>

          <Text style={styles.logoText}>Vii Music</Text>
          <Text style={styles.headerText}>Đăng nhập vào tài khoản của bạn</Text>

          {/* FORM */}
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

          {/* OPTIONS */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.optionsText}>Nhớ tôi</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          {/* BUTTON LOGIN */}
          <GradientButton title="Đăng nhập" onPress={() => {}} />

          {/* SEPARATOR */}
          <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>Hoặc tiếp tục với</Text>
            <View style={styles.line} />
          </View>

          {/* GOOGLE BTN */}
          <GoogleButton title="Đăng nhập với Google" onPress={() => {}} />

          {/* FOOTER */}
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

export default LoginScreen;

// -----------------------------------------------
// STYLES
// -----------------------------------------------
const styles = StyleSheet.create({
  bg: { flex: 1 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

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

  logoIcon: {
    fontSize: 38,
    color: "#fff",
    fontWeight: "900",
  },

  logoText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E8D1FF",
    marginBottom: 20,
  },

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

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
    alignItems: "center",
  },

  checkboxContainer: { flexDirection: "row", alignItems: "center" },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxChecked: { backgroundColor: "#24C4FC", borderColor: "#24C4FC" },

  checkboxCheck: {
    color: "#0F1B2E",
    fontSize: 12,
    fontWeight: "bold",
  },

  optionsText: { color: "#fff", marginLeft: 8 },

  forgotPassword: {
    color: "#24C4FC",
    fontWeight: "600",
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

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.28)",
  },

  separatorText: {
    marginHorizontal: 15,
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
  },

  googleButton: {
    flexDirection: "row",
    width: "100%",
    height: 55,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },

  googleIconContainer: {
    width: 26,
    height: 26,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  googleIconText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4285F4",
  },

  googleButtonText: {
    color: "#1E1E3F",
    fontSize: 16,
    fontWeight: "600",
  },

  footerRow: { flexDirection: "row" },

  footerText: { color: "#fff", fontSize: 16 },

  footerLink: {
    color: "#24C4FC",
    fontSize: 16,
    fontWeight: "bold",
  },
});
