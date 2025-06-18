import React, { useContext, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Platform,
} from "react-native";
import * as Speech from "expo-speech";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { BookmarkContext } from "../context/BookmarkContext";
import cryptoPlaceholder from "../assets/images/crypto.png";

export default function NewsCard({ article }) {
  const navigation = useNavigation();
  const { addBookmark, removeBookmark, isBookmarked } =
    useContext(BookmarkContext);
  const bookmarked = isBookmarked(article.url);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const estimatedDuration = useRef(1);

  const handleAudioPress = () => {
    if (!article.summary) return;

    if (!isPlaying) {
      showToast("Reading summary aloud...");

      // Estimate duration based on character count (approx 15 chars/sec)
      const wordsPerSecond = 3; // Roughly 3 wps
      const wordCount = article.summary.trim().split(/\s+/).length;
      estimatedDuration.current = (wordCount / wordsPerSecond) * 1000;

      let startTime = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setProgress(Math.min(elapsed / estimatedDuration.current, 1));
      }, 200);

      Speech.speak(article.summary, {
        rate: 1.0,
        pitch: 1.0,
        language: "en-US",
        onDone: () => {
          clearInterval(intervalRef.current);
          setProgress(0);
          setIsPlaying(false);
        },
        onStopped: () => {
          clearInterval(intervalRef.current);
          setProgress(0);
          setIsPlaying(false);
        },
        onError: () => {
          clearInterval(intervalRef.current);
          setProgress(0);
          setIsPlaying(false);
        },
      });

      setIsPlaying(true);
    } else {
      Speech.stop();
      clearInterval(intervalRef.current);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const showToast = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // For iOS, fallback or use 3rd party
      console.log("Toast:", message);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Article", { article })}
    >
      <View style={styles.card}>
        <Image
          source={
            article.imageUrl ? { uri: article.imageUrl } : cryptoPlaceholder
          }
          style={styles.image}
        />

        <View style={styles.content}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.meta}>
            {article.source} • {article.date}
          </Text>
          <View style={{ marginBottom: 10 }}>
            {article.summary && (
              <View style={styles.badge}>
                <Image
                  source={require("../assets/images/openai.png")}
                  style={{ width: 12, height: 12, marginRight: 4 }}
                />
                <Text style={styles.badgeText}>AI Summary</Text>
              </View>
            )}
            <Text style={styles.summary}>{article.summary}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.audioButton,
              !article.summary && { backgroundColor: "#ccc" },
            ]}
            onPress={handleAudioPress}
            disabled={!article.summary}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={20}
              color="#fff"
            />
            <Text style={styles.audioText}>
              {isPlaying ? "Pause" : article.summary ? "Listen" : "No Summary"}
            </Text>
          </TouchableOpacity>

          {isPlaying && (
            <Slider
              style={styles.seekBar}
              minimumValue={0}
              maximumValue={1}
              value={progress}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.accent}
              thumbTintColor={colors.darkblue}
              disabled
            />
          )}
        </View>
        <View style={{ position: "absolute", top: 10, right: 10 }}>
          <TouchableOpacity
            onPress={() =>
              bookmarked ? removeBookmark(article.url) : addBookmark(article)
            }
          >
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    color: colors.subtext,
    marginVertical: 4,
  },
  summary: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  audioText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
  seekBar: {
    width: "100%",
    height: 10,
    marginTop: 5,
  },
  badge: {
    flexDirection: "row", // ← horizontal layout
    alignItems: "center", // ← center vertically
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 10,
    color: "#fff", // make text black
    fontWeight: "normal",
  },
});
