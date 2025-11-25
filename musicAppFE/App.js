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
  // Mặc định mở Login
  const [currentScreen, setCurrentScreen] = useState("Login");

  // Điều hướng đơn giản
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
            onLoginSuccess={navigateToHome}   // về trang Home sau login
          />
        )}

        {/* REGISTER */}
        {currentScreen === "Register" && (
          <RegisterScreen
            onNavigateToLogin={navigateToLogin}
            onRegisterSuccess={navigateToHome}  // về Home sau khi tạo tk
          />
        )}

        {/* HOME */}
        {currentScreen === "Home" && (
          <View style={{ flex: 1 }}>
            <HomeScreen
              onNavigateToList={navigateToList}
              onSongPress={navigateToDetail}  // Nhấn bài hát → Detail
            />
            <FooterComponent />
          </View>
        )}

        {/* LIST */}
        {currentScreen === "List" && (
          <View style={{ flex: 1 }}>
            <ListScreen
              onBack={navigateToHome}
              onSongPress={navigateToDetail}   // Nhấn bài hát → Detail
            />
            <FooterComponent />
          </View>
        )}

        {/* DETAIL SONG */}
        {currentScreen === "DetailSong" && (
          <View style={{ flex: 1 }}>
            <DetailSong onBack={navigateToList} />  // quay lại màn List
            {/* Không có Footer ở đây */}
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
