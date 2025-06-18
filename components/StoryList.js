import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import colors from "../constants/colors";
import { useNavigation } from "@react-navigation/native";

export default function StoryList({ stories = [] }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Top Stories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.story}
            onPress={() =>
              navigation.navigate("FullArticle", { url: story.url })
            }
          >
            <Image source={{ uri: story.image }} style={styles.image} />
            <Text style={styles.title} numberOfLines={1}>
              {story.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 16,
    marginBottom: 8,
  },
  story: {
    width: 90,
    alignItems: "center",
    marginLeft: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 6,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 12,
    color: colors.subtext,
    textAlign: "center",
  },
});
