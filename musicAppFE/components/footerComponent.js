import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

// Import SVG icons
import HomeIcon from "../assets/icons/home.svg";
import HeartIcon from "../assets/icons/heart.svg";
import PlayIcon from "../assets/icons/play.svg";
import PersonIcon from "../assets/icons/person.svg";
import ListIcon from "../assets/icons/list.svg";

const FooterComponent = ({
  activeTab = "home",
  onPressHome,
  onPressList,
  onPressPlay,
  onPressHeart,
  onPressPerson,
}) => {
  const handlePress = (callback) => {
    if (typeof callback === "function") {
      callback();
    }
  };

  return (
    <View style={styles.footerContainer}>
      {/* HOME */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress(onPressHome)}
      >
        <HomeIcon
          width={26}
          height={26}
          fill={activeTab === "home" ? "#24F7BC" : "#ffffff"}
        />
        {activeTab === "home" && <View style={styles.activeLine} />}
      </TouchableOpacity>

      {/* LIST */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress(onPressList)}
      >
        <ListIcon
          width={26}
          height={26}
          fill={activeTab === "list" ? "#24F7BC" : "#ffffff"}
        />
        {activeTab === "list" && <View style={styles.activeLine} />}
      </TouchableOpacity>

      {/* PLAY */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress(onPressPlay)}
      >
        <PlayIcon
          width={26}
          height={26}
          fill={activeTab === "play" ? "#24F7BC" : "#ffffff"}
        />
        {activeTab === "play" && <View style={styles.activeLine} />}
      </TouchableOpacity>

      {/* HEART */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress(onPressHeart)}
      >
        <HeartIcon
          width={26}
          height={26}
          fill={activeTab === "heart" ? "#24F7BC" : "#ffffff"}
        />
        {activeTab === "heart" && <View style={styles.activeLine} />}
      </TouchableOpacity>

      {/* PERSON */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress(onPressPerson)}
      >
        <PersonIcon
          width={26}
          height={26}
          fill={activeTab === "person" ? "#24F7BC" : "#ffffff"}
        />
        {activeTab === "person" && <View style={styles.activeLine} />}
      </TouchableOpacity>
    </View>
  );
};

export default FooterComponent;

const styles = StyleSheet.create({
  footerContainer: {
    height: 80,
    backgroundColor: "#1A1D24",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeLine: {
    width: 22,
    height: 4,
    backgroundColor: "#24F7BC",
    borderRadius: 10,
    marginTop: 6,
  },
});
