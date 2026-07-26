import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import type { UserProfile } from "../../types/profile";
import { getUnreadNotificationCount } from "../../services/notificationService";

type Props = {
  profile: UserProfile | null;
};

const PRIMARY = "#0F8A83"

export default function Header({ profile }: Props) {
  const navigation = useNavigation<any>();

  const [notificationCount, setNotificationCount] = useState(0);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useFocusEffect(
    useCallback(() => {
      const loadCount = async () => {
        const count = await getUnreadNotificationCount();
        setNotificationCount(count);
      };

      loadCount();
    }, [])
  );

  const getInitial = () => {
    if (!profile?.full_name) return "G";
    return profile.full_name.charAt(0).toUpperCase();
  };
  return (
    <View style={styles.container}>
      {/* Left Side */}
      <View style={styles.leftContainer}>
        {profile?.avatar_uri ? (
          <Image
            source={{ uri: profile.avatar_uri }}
            style={styles.avatarImage}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitial()}</Text>
          </View>
        )}

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.greeting}>
            {getGreeting()} 👋
          </Text>

<Text style={styles.name}>
  {profile?.full_name || "Guest"}
</Text>
        </View>
      </View>

      {/* Right Side */}
      <View style={styles.rightContainer}>
<TouchableOpacity
  style={styles.iconButton}
  onPress={() => navigation.navigate("Notification")}
>
  <Ionicons
    name="notifications-outline"
    size={24}
    color="#1F2937"
  />

  {notificationCount > 0 && (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {notificationCount > 99 ? "99+" : notificationCount}
      </Text>
    </View>
  )}
</TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color="#1F2937"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  greeting: {
    fontSize: 14,
    color: "#6B7280",
  },

  name: {
    marginTop: 3,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  badge: {
  position: "absolute",
  top: -4,
  right: -4,
  minWidth: 18,
  height: 18,
  borderRadius: 9,
  backgroundColor: "#EF4444",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 4,
},

badgeText: {
  color: "#FFFFFF",
  fontSize: 10,
  fontWeight: "700",
},
});