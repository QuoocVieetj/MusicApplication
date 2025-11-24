import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import LoginScreen from "./screens/Auth/loginScreen";
import RegisterScreen from "./screens/Auth/registerScreen";
import HomeScreen from "./screens/Home/homeScreen";
import ListScreen from "./screens/List/listScreen";
import DetailSong from "./screens/SongPlay/detailSong";
import FooterComponent from "./components/footerComponent";

const App = () => {
  // const [currentScreen, setCurrentScreen] = useState("Login");
  const [currentScreen, setCurrentScreen] = useState("DetailSong");

  const navigateToRegister = () => setCurrentScreen("Register");
  const navigateToLogin = () => setCurrentScreen("Login");
  const navigateToHome = () => setCurrentScreen("Home");
  const navigateToList = () => setCurrentScreen("List");
  const navigateToDetail = () => setCurrentScreen("DetailSong");  // ⬅ THÊM

  return (
    <View style={styles.container}>
      
      {/* LOGIN */}
      {/* 
      {currentScreen === "Login" && (
        <LoginScreen
          onNavigateToRegister={navigateToRegister}
          onLoginSuccess={navigateToHome}
        />
      )} 
      */}

      {/* REGISTER */}
      {/* 
      {currentScreen === "Register" && (
        <RegisterScreen
          onNavigateToLogin={navigateToLogin}
          onRegisterSuccess={navigateToHome}
        />
      )} 
      */}

      {/* HOME SCREEN */}
      {currentScreen === "Home" && (
        <View style={{ flex: 1 }}>
          <HomeScreen 
            onNavigateToList={navigateToList}
            onSongPress={navigateToDetail}        // ⬅ BẤM BÀI HÁT → DETAIL
          />
          <FooterComponent />
        </View>
      )}

      {/* LIST SCREEN */}
      {currentScreen === "List" && (
        <View style={{ flex: 1 }}>
          <ListScreen 
            onBack={navigateToHome}
            onSongPress={navigateToDetail}        // ⬅ BẤM BÀI HÁT → DETAIL
          />
          <FooterComponent />
        </View>
      )}

      {/* DETAIL SONG SCREEN */}
      {currentScreen === "DetailSong" && (
        <View style={{ flex: 1 }}>
          <DetailSong onBack={navigateToList} />  // ⬅ QUAY LẠI LIST
          {/* KHÔNG có footer ở đây */}
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1218",
  },
});

export default App;
