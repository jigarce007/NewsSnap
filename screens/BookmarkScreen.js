import React, { useContext, useLayoutEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { BookmarkContext } from "../context/BookmarkContext";
import NewsCard from "../components/NewsCard";
import colors from "../constants/colors";

export default function BookmarkScreen({ navigation }) {
  const { bookmarks, removeBookmark, clearBookmarks } =
    useContext(BookmarkContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        bookmarks.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Delete All Bookmarks",
                "Are you sure you want to delete all bookmarks?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Yes", onPress: clearBookmarks },
                ]
              );
            }}
            style={{ marginRight: 12 }}
          >
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, bookmarks]);

  const renderItem = ({ item }) => {
    const renderRightActions = () => (
      <TouchableOpacity
        onPress={() => removeBookmark(item.url)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <NewsCard article={item} />
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No bookmarks yet.</Text>}
        contentContainerStyle={
          bookmarks.length === 0 ? { flex: 1, justifyContent: "center" } : {}
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 0,
  },
  empty: {
    textAlign: "center",
    color: colors.subtext,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginVertical: 8,
    borderRadius: 8,
  },
});
