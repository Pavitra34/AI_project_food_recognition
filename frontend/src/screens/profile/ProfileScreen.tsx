import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import AppHeader from "../../components/common/AppHeader";
import BMIScale from "../../components/profile/BMIScale";
import { getProfile } from "../../services/profileService";
import type { UserProfile } from "../../types/profile";
import { getBMIBadgeStyle } from "../../utils/bmi";
import {
  clearAuthSession,
  getStoredAuthUser,
  saveProfileAvatar,
} from "../../utils/profileStorage";
import { showError, showSuccess } from "../../utils/toast";

const PRIMARY = "#0F8A83";

type InfoItemProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

function InfoItem({ label, value, highlight = false }: InfoItemProps) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>
        {value}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.log("Profile load error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const getInitial = () => {
    if (!profile?.full_name) return "U";
    return profile.full_name.charAt(0).toUpperCase();
  };

  const handlePickAvatar = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showError("Gallery permission is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !profile) {
      return;
    }

    try {
      const authUser = await getStoredAuthUser();

      if (!authUser?.id) {
        showError("User not found");
        return;
      }

      const avatarUri = result.assets[0].uri;
      await saveProfileAvatar(authUser.id, avatarUri);

      setProfile({
        ...profile,
        avatar_uri: avatarUri,
      });

      showSuccess("Profile photo updated");
    } catch (error) {
      console.log(error);
      showError("Failed to save profile photo");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
onPress: async () => {
  console.log("Logout button clicked");

  await clearAuthSession();

  navigation.reset({
    index: 0,
    routes: [{ name: "Auth" }],
  });
},
      },
    ]);
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Choose an action", [
      {
        text: "Edit Profile",
        onPress: () => navigation.navigate("EditProfile"),
      },
      {
        text: "Update BMI",
        onPress: () => navigation.navigate("UpdateBMI"),
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: handleLogout,
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const badgeStyle = getBMIBadgeStyle(profile?.bmi_category);

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.loaderContainer} edges={["top"]}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader
        title="My Profile"
        showBack={false}
        rightComponent={
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSettings}
          >
            <Ionicons name="settings-outline" size={22} color="#111827" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
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

            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handlePickAvatar}
            >
              <Ionicons name="pencil" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{profile?.full_name ?? "Guest User"}</Text>
          <Text style={styles.email}>{profile?.email ?? "No email"}</Text>

          <View style={styles.memberBadge}>
            <Ionicons name="calendar-outline" size={16} color={PRIMARY} />
            <Text style={styles.memberText}>
              Member Since: {profile?.member_since ?? "Recently"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#9CA3AF"
            />
          </View>

          <View style={styles.infoGrid}>
            <InfoItem label="Gender" value={profile?.gender ?? "--"} />
            <InfoItem label="Age" value={profile?.age?.toString() ?? "--"} />
            <InfoItem
              label="Height"
              value={profile?.height ? `${profile.height} cm` : "--"}
            />
            <InfoItem
              label="Weight"
              value={profile?.weight ? `${profile.weight} kg` : "--"}
            />
            <InfoItem
              label="BMI Score"
              value={profile?.bmi?.toFixed(1) ?? "--"}
              highlight
            />
            <InfoItem label="Health Goal" value={profile?.goal ?? "--"} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Health Status</Text>

          <View style={styles.bmiRow}>
            <Text style={styles.bmiValue}>
              {profile?.bmi?.toFixed(1) ?? "--"}{" "}
              <Text style={styles.bmiLabel}>BMI</Text>
            </Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: badgeStyle.backgroundColor },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: badgeStyle.color },
                ]}
              >
                {profile?.bmi_category ?? "Not Set"}
              </Text>
            </View>
          </View>

          <BMIScale bmi={profile?.bmi} />
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("UpdateBMI")}
        >
          <Ionicons name="fitness-outline" size={20} color={PRIMARY} />
          <Text style={styles.secondaryButtonText}>Update BMI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.chatButton}
                    onPress={() => navigation.navigate("Chat")}
                  >
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={28}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F8FB",
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  profileHeader: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 24,
  },

  avatarWrap: {
    position: "relative",
    marginBottom: 16,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: PRIMARY,
    borderWidth: 4,
    borderColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#D1FAE5",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "700",
  },

  editAvatarButton: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  email: {
    marginTop: 6,
    fontSize: 15,
    color: "#6B7280",
  },

  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F8F6",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
  },

  memberText: {
    marginLeft: 8,
    color: PRIMARY,
    fontWeight: "600",
    fontSize: 13,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  infoItem: {
    width: "48%",
    marginBottom: 18,
  },

  infoLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 6,
  },

  infoValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  infoValueHighlight: {
    color: PRIMARY,
  },

  bmiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },

  bmiValue: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111827",
  },

  bmiLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
  },

  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  statusBadgeText: {
    fontWeight: "700",
    fontSize: 13,
  },

  primaryButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  secondaryButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#E6F8F6",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  secondaryButtonText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  logoutButton: {
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  logoutText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },
   chatButton: {
  position: "absolute",

  right: 20,
  bottom: 90,

  width: 65,
  height: 65,

  borderRadius: 35,

  backgroundColor: "#0F8A83",

  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 6,
  shadowOffset: {
    width: 0,
    height: 4,
  },

  elevation: 8,
},
});
