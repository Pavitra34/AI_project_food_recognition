import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { AppNotification } from "../model/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStoredAuthUser } from "../utils/profileStorage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function getNotificationKey() {
  const authUser = await getStoredAuthUser();

  if (!authUser?.id) {
    throw new Error("User not authenticated");
  }

  return `app_notifications_${authUser.id}`;
}

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    return;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Notification permission denied");
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      "water-reminder",
      {
        name: "Water Reminder",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      }
    );
  }
}

export async function sendTestNotification() {
  await saveNotification(
    "💧 Water Reminder",
    "Drink a glass of water now!"
  );

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "💧 Water Reminder",
      body: "Drink a glass of water now!",
      sound: "default",
    },
    trigger: null,
  });
}

export async function saveNotification(
  title: string,
  message: string
) {
  try {
    const key = await getNotificationKey();

    const existing = await AsyncStorage.getItem(key);

    const notifications: AppNotification[] = existing
      ? JSON.parse(existing)
      : [];

    notifications.unshift({
      id: Date.now().toString(),
      title,
      message,
      createdAt: new Date().toISOString(),
      isRead: false,
    });

    await AsyncStorage.setItem(
      key,
      JSON.stringify(notifications)
    );
  } catch (error) {
    console.log("Save notification error:", error);
  }
}

export async function clearNotifications() {
  try {
    const key = await getNotificationKey();

    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
}

export async function getNotifications() {
  try {
    const key = await getNotificationKey();

    const data = await AsyncStorage.getItem(key);

    if (!data) {
      return [];
    }

    return JSON.parse(data) as AppNotification[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getUnreadNotificationCount() {
  try {
    const data = await getNotifications();

    return data.filter((item) => !item.isRead).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

export async function sendWaterProgressNotification(
  drank: number,
  remaining: number
) {
  const title =
    remaining > 0
      ? "💧 Great Job!"
      : "🎉 Daily Goal Achieved!";

  const body =
    remaining > 0
      ? `You drank ${drank} ml of water. ${remaining} ml remaining to reach today's goal.`
      : "Congratulations! You reached today's water goal.";

  await saveNotification(title, body);

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: null,
  });
}

export async function markAllNotificationsAsRead() {
  try {
    const key = await getNotificationKey();

    const data = await AsyncStorage.getItem(key);

    if (!data) return;

    const notifications: AppNotification[] = JSON.parse(data);

    const updated = notifications.map((item) => ({
      ...item,
      isRead: true,
    }));

    await AsyncStorage.setItem(
      key,
      JSON.stringify(updated)
    );
  } catch (error) {
    console.log(error);
  }
}