import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { goToPlayTab } from "../redux/slice/uiSlice";

const FavoriteScreen = ({ onSelectSong }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.list);

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Chưa có bài hát yêu thích ❤️</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onSelectSong(item);
            dispatch(goToPlayTab());
          }}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.artist}>
            {item.artistName || item.genreName}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default FavoriteScreen;
