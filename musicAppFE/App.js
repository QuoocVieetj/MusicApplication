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
import SearchScreen from "./screens/Search/searchScreen";
import ProfileScreen from "./screens/Profile/profileScreen";
import FooterComponent from "./components/footerComponent";

const App = () => {
  // Mặc định mở Login
  const [currentScreen, setCurrentScreen] = useState("Login");
  const [selectedSong, setSelectedSong] = useState(null);
  const [previousScreen, setPreviousScreen] = useState("Home");

  // Điều hướng đơn giản
  const navigateToRegister = () => setCurrentScreen("Register");
  const navigateToLogin = () => setCurrentScreen("Login");
  const navigateToHome = () => setCurrentScreen("Home");
  const navigateToList = () => setCurrentScreen("List");
  const navigateToSearch = () => setCurrentScreen("Search");
  const navigateToProfile = () => setCurrentScreen("Profile");
  const navigateToDetail = (song) => {
    setSelectedSong(song);
    setPreviousScreen(currentScreen); // Lưu màn hình hiện tại
    setCurrentScreen("DetailSong");
  };
  const changeSongInDetail = (song) => {
    setSelectedSong(song);
  };
  
  const navigateBackFromDetail = () => {
    setCurrentScreen(previousScreen); // Quay lại màn hình trước đó
  };

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
              onNavigateToSearch={navigateToSearch}
            />
            <FooterComponent
              activeTab="home"
              onPressHome={navigateToHome}
              onPressList={navigateToList}  // Nhấn icon list → màn List
              onPressPerson={navigateToProfile}
            />
          </View>
        )}

        {/* LIST */}
        {currentScreen === "List" && (
          <View style={{ flex: 1 }}>
            <ListScreen
              onBack={navigateToHome}
              onSongPress={navigateToDetail}   // Nhấn bài hát → Detail
            />
            <FooterComponent
              activeTab="list"
              onPressHome={navigateToHome}
              onPressList={navigateToList}
              onPressPerson={navigateToProfile}
            />
          </View>
        )}

        {/* DETAIL SONG */}
        {currentScreen === "DetailSong" && (
          <View style={{ flex: 1 }}>
            <DetailSong 
              onBack={navigateBackFromDetail}
              song={selectedSong}
              onChangeSong={changeSongInDetail}
            />
            {/* Không có Footer ở đây */}
          </View>
        )}

        {/* SEARCH */}
        {currentScreen === "Search" && (
          <View style={{ flex: 1 }}>
            <SearchScreen
              onBack={navigateToHome}
              onSongPress={navigateToDetail}
            />
            <FooterComponent
              activeTab="home"
              onPressHome={navigateToHome}
              onPressList={navigateToList}
              onPressPerson={navigateToProfile}
            />
          </View>
        )}

        {/* PROFILE */}
        {currentScreen === "Profile" && (
          <View style={{ flex: 1 }}>
            <ProfileScreen />
            <FooterComponent
              activeTab="person"
              onPressHome={navigateToHome}
              onPressList={navigateToList}
              onPressPerson={navigateToProfile}
            />
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
