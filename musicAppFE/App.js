import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import LoginScreen from "./screens/Auth/loginScreen";
import RegisterScreen from "./screens/Auth/registerScreen";
import HomeScreen from "./screens/Home/homeScreen";
import FooterComponent from "./components/footerComponent";

const App = () => {
  // const [currentScreen, setCurrentScreen] = useState("Login");
  const [currentScreen, setCurrentScreen] = useState("Home");

  const navigateToRegister = () => setCurrentScreen("Register");
  const navigateToLogin = () => setCurrentScreen("Login");
  const navigateToHome = () => setCurrentScreen("Home");

  return (
    <View style={styles.container}>

      {/* LOGIN */}
      {/* {currentScreen === "Login" && (
        <LoginScreen
          onNavigateToRegister={navigateToRegister}
          onLoginSuccess={navigateToHome}
        />
      )} */}

      {/* REGISTER */}
      {/* {currentScreen === "Register" && (
        <RegisterScreen
          onNavigateToLogin={navigateToLogin}
          onRegisterSuccess={navigateToHome}
        />
      )} */}

      {/* HOME */}
      {currentScreen === "Home" && (
        <View style={{ flex: 1 }}>
          <HomeScreen />
          <FooterComponent />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1218" },
});

export default App;
