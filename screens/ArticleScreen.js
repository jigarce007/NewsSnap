import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import colors from "../constants/colors";
import { summarizeArticle } from "../utils/summarize";

export default function ArticleScreen({ route }) {
  const { article } = route.params;
  const navigation = useNavigation();

  const [aiSummary, setAiSummary] = useState(article.summary || "");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!article.summary) {
        setLoading(true);
        try {
          const summary = await summarizeArticle(
            article.title,
            article.content || article.description || ""
          );
          setAiSummary(summary || "Summary not available.");
        } catch (error) {
          console.error("Error fetching AI summary:", error);
          setAiSummary("Failed to generate summary.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSummary();
  }, []);

  const handleAudioPress = () => {
    if (!aiSummary) return;

    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } else {
      Speech.speak(aiSummary, {
        language: "en",
        rate: 1.0,
        onDone: () => setIsPlaying(false),
      });
      setIsPlaying(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {article.imageUrl ? (
        <Image source={{ uri: article.imageUrl }} style={styles.image} />
      ) : null}
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.meta}>
          {article.source} • {article.date}
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <>
            <Text style={styles.section}>AI Summary</Text>
            <Text style={styles.summary}>{aiSummary}</Text>

            <TouchableOpacity
              style={[
                styles.audioButton,
                !aiSummary && { backgroundColor: "#ccc" },
              ]}
              onPress={handleAudioPress}
              disabled={!aiSummary}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.audioText}>
                {isPlaying ? "Pause" : aiSummary ? "Listen" : "No Summary"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.readButton}
        onPress={() => navigation.navigate("FullArticle", { url: article.url })}
      >
        <Text style={styles.readText}>Read Full Article</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: 12,
  },
  section: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: colors.primary,
  },
  summary: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  audioText: {
    color: "#fff",
    fontSize: 16,
  },
  readButton: {
    backgroundColor: colors.darkblue,
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  readText: {
    color: "#fff",
    fontWeight: "normal",
  },
});
