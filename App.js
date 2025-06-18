import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Share, TouchableOpacity, View } from "react-native";
import { BookmarkProvider } from "./context/BookmarkContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Screens
import HomeScreen from "./screens/HomeScreen";
import ArticleScreen from "./screens/ArticleScreen";
import SplashScreen from "./screens/SplashScreen";
import FullArticleScreen from "./screens/FullArticleScreen";
import BookmarkScreen from "./screens/BookmarkScreen";
import ProfileScreen from "./screens/ProfileScreen";

// Theme
import colors from "./constants/colors";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: "#ffffff",
    text: colors.text,
    border: "transparent",
  },
};

// Share button
const getShareHeaderButton = (url) => ({
  headerRight: () => (
    <TouchableOpacity
      onPress={() => Share.share({ message: url })}
      style={{ marginRight: 12 }}
    >
      <Ionicons
        name="share-social-outline"
        size={22}
        color={colors.textwhite}
      />
    </TouchableOpacity>
  ),
});

// Stack for Home tab
function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.darkblue,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 3,
        },
        headerTintColor: colors.textwhite,
        headerTitleStyle: {
          fontWeight: "normal",
          fontSize: 20,
          color: colors.textwhite,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Top Stories" }}
      />
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => {
          const url = route.params?.article?.url;
          return {
            title: "Full Article",
            ...getShareHeaderButton(url),
          };
        }}
      />
      <Stack.Screen
        name="FullArticle"
        component={FullArticleScreen}
        options={({ route }) => ({
          title: "Full Article",
          ...getShareHeaderButton(route.params?.url),
        })}
      />
    </Stack.Navigator>
  );
}

// Stack for Bookmarks tab
function BookmarkStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.darkblue,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 3,
        },
        headerTintColor: colors.textwhite,
        headerTitleStyle: {
          fontWeight: "normal",
          fontSize: 20,
          color: colors.textwhite,
        },
      }}
    >
      <Stack.Screen
        name="Bookmarks"
        component={BookmarkScreen}
        options={{ title: "Bookmarks" }}
      />
    </Stack.Navigator>
  );
}

// Bottom Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.darkblue },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: "#aaa",
        tabBarIcon: ({ color, size }) => {
          let icon =
            route.name === "Home"
              ? "newspaper-outline"
              : route.name === "Bookmarks"
              ? "bookmark-outline"
              : "person-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Bookmarks" component={BookmarkStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Root App
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BookmarkProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" backgroundColor={colors.darkblue} />
          <View style={{ height: 24, backgroundColor: colors.darkblue }} />
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </BookmarkProvider>
    </GestureHandlerRootView>
  );
}
