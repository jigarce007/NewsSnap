import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Image,
} from "react-native";
import axios from "axios";
import StoryList from "../components/StoryList";
import NewsCard from "../components/NewsCard";
import colors from "../constants/colors";
import { TECHCRUNCH_URL, TECHCRUNCH_ALL_URL } from "../constants/api";
import { summarizeArticle } from "../utils/summarize";

export default function HomeScreen() {
  const [topStories, setTopStories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const spinValue = useState(new Animated.Value(0))[0];

  // Start the spinning animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    fetchTopStories();
    fetchArticles();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const fetchTopStories = async () => {
    try {
      const response = await axios.get(TECHCRUNCH_URL);
      const formatted = response.data.articles.map((item, index) => ({
        id: index.toString(),
        title: item.title,
        image: item.urlToImage || "https://via.placeholder.com/400x400",
        url: item.url,
      }));
      setTopStories(formatted);
    } catch (error) {
      console.error("Error fetching top stories:", error);
    }
  };

  const fetchArticles = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await axios.get(`${TECHCRUNCH_ALL_URL}&page=${pageNum}`);

      const newArticles = await Promise.all(
        response.data.articles.map(async (item) => {
          const summary =
            item.description ||
            (await summarizeArticle(
              item.title,
              item.content || item.description || ""
            ));

          return {
            ...item,
            summary: summary || "Summary not available",
          };
        })
      );

      setArticles((prev) =>
        pageNum === 1 ? newArticles : [...prev, ...newArticles]
      );
    } catch (error) {
      console.error("Error fetching or summarizing articles:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(nextPage);
    }
  };

  if (loading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.Image
          source={require("../assets/images/openai.png")}
          style={[styles.loadingImage, { transform: [{ rotate: spin }] }]}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StoryList stories={topStories} />
      <FlatList
        data={articles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <NewsCard
            article={{
              title: item.title,
              summary: item.summary,
              source: item.source.name,
              date: new Date(item.publishedAt).toLocaleDateString(),
              imageUrl: item.urlToImage,
              url: item.url,
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <Animated.Image
              source={require("../assets/images/openai.png")}
              style={[
                styles.loadingImage,
                {
                  alignSelf: "center",
                  marginVertical: 16,
                  transform: [{ rotate: spin }],
                },
              ]}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingImage: {
    width: 50,
    height: 50,
  },
});
