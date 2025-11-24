import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

// 🟢 Redux Provider + Store
import { Provider } from "react-redux";
import store from "./redux/store";

// 🟢 Screens
import LoginScreen from "./screens/Auth/loginScreen";
import RegisterScreen from "./screens/Auth/registerScreen";
import HomeScreen from "./screens/Home/homeScreen";
import ListScreen from "./screens/List/listScreen";
import DetailSong from "./screens/SongPlay/detailSong";
import FooterComponent from "./components/footerComponent";

const App = () => {
  // 👇 App mở lên mặc định vào Login
  const [currentScreen, setCurrentScreen] = useState("Login");

  // 👇 Chuyển màn
  const navigateToRegister = () => setCurrentScreen("Register");
  const navigateToLogin = () => setCurrentScreen("Login");
  const navigateToHome = () => setCurrentScreen("Home");
  const navigateToList = () => setCurrentScreen("List");
  const navigateToDetail = () => setCurrentScreen("DetailSong");

  return (
    <Provider store={store}>
      <View style={styles.container}>

        {/* LOGIN */}
        {currentScreen === "Login" && (
          <LoginScreen
            onNavigateToRegister={navigateToRegister}
            onLoginSuccess={navigateToHome}   // <- chạy khi đăng nhập thành công
          />
        )}

        {/* REGISTER */}
        {currentScreen === "Register" && (
          <RegisterScreen
            onNavigateToLogin={navigateToLogin}
            onRegisterSuccess={navigateToHome}  // <- chạy khi đăng ký xong
          />
        )}

        {/* HOME */}
        {currentScreen === "Home" && (
          <View style={{ flex: 1 }}>
            <HomeScreen onNavigateToList={navigateToList} />
            <FooterComponent />
          </View>
        )}

        {/* LIST */}
        {currentScreen === "List" && (
          <View style={{ flex: 1 }}>
            <ListScreen
              onBack={navigateToHome}
              onSongPress={navigateToDetail}
            />
            <FooterComponent />
          </View>
        )}

        {/* DETAIL SONG */}
        {currentScreen === "DetailSong" && (
          <View style={{ flex: 1 }}>
            <DetailSong onBack={navigateToList} />
          </View>
        )}

      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1218",
  },
});

export default App;
