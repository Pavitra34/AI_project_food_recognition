import React, { useCallback, useState } from "react";
import {
  View,
 Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import AppHeader from "../../components/common/AppHeader";
import {
  getNotifications,
  clearNotifications,
   markAllNotificationsAsRead,
  
} from "../../services/notificationService";
import { AppNotification } from "../../model/notification";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadNotifications = async () => {
    const data = await getNotifications();
    console.log(data);
    setNotifications(data);
  };

useFocusEffect(
  useCallback(() => {
    const loadData = async () => {
      await markAllNotificationsAsRead();
      await loadNotifications();
    };

    loadData();
  }, [])
);

  const handleClear = async () => {
    await clearNotifications();
    setNotifications([]);
  };




  const renderItem = ({ item }: { item: AppNotification }) => (
    <View style={styles.card}>
      <Ionicons
        name="notifications"
        size={24}
        color="#0F8A83"
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.message}>
          {item.message}
        </Text>

        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Notifications" showBack />

      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClear}
      >
        <Text style={styles.clearText}>
          Clear All
        </Text>
      </TouchableOpacity>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No notifications yet.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  clearButton: {
    alignSelf: "flex-end",
    marginRight: 20,
    marginBottom: 10,
  },

  clearText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    elevation: 3,
  },

  content: {
    flex: 1,
    marginLeft: 15,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  message: {
    marginTop: 4,
    color: "#6B7280",
  },

  time: {
    marginTop: 8,
    color: "#9CA3AF",
    fontSize: 12,
  },

  empty: {
    textAlign: "center",
    marginTop: 80,
    color: "#9CA3AF",
    fontSize: 16,
  },
});