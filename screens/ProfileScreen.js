import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../constants/colors";

export default function ProfileScreen() {
  const handleOptionPress = (label) => {
    switch (label) {
      case "Send Feedback":
        Linking.openURL("mailto:feedback@example.com?subject=App Feedback");
        break;
      case "About":
        Alert.alert("About", "NewsPulse v1.0\nMade with ❤️ for readers.");
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Header */}
      <LinearGradient colors={["#002a47", "#2E86DE"]} style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            style={styles.avatar}
          />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.name}>Jigar Makwana</Text>
            <Text style={styles.email}>jigar@example.com</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickRow}>
        <ActionButton icon="bookmark-outline" label="Bookmarks" />
        <ActionButton icon="settings-outline" label="Settings" />
        <ActionButton icon="log-out-outline" label="Logout" />
      </View>

      {/* Preferences */}
      <Section title="My Preferences">
        <Option icon="notifications-outline" label="Notification Settings" />
        <Option icon="language-outline" label="Language" />
        <Option icon="color-palette-outline" label="Theme" />
      </Section>

      {/* Account */}
      <Section title="Account">
        <Option icon="person-outline" label="Edit Profile" />
        <Option icon="card-outline" label="Manage Subscription" />
      </Section>

      {/* Support */}
      <Section title="Support">
        <Option icon="help-circle-outline" label="Help Center" />
        <Option
          icon="mail-outline"
          label="Send Feedback"
          onPress={handleOptionPress}
        />
        <Option
          icon="information-circle-outline"
          label="About"
          onPress={handleOptionPress}
        />
      </Section>
    </ScrollView>
  );
}

const ActionButton = ({ icon, label }) => (
  <TouchableOpacity style={styles.actionBtn}>
    <Ionicons name={icon} size={24} color={colors.accent} />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const Section = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const Option = ({ icon, label, onPress }) => (
  <TouchableOpacity
    style={styles.optionRow}
    onPress={() => (onPress ? onPress(label) : null)}
  >
    <Ionicons name={icon} size={22} color={colors.text} />
    <Text style={styles.optionLabel}>{label}</Text>
    <Ionicons
      name="chevron-forward"
      size={20}
      color="#ccc"
      style={{ marginLeft: "auto" }}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: 14,
    color: "#e0e0e0",
  },
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    marginBottom: 8,
  },
  actionBtn: {
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.text,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  optionLabel: {
    fontSize: 15,
    marginLeft: 12,
    color: colors.text,
  },
});
