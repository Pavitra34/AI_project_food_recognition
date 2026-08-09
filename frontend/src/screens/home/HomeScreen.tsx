import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/home/Header";
import SearchBar from "../../components/home/SearchBar";
import NutritionCard from "../../components/home/NutritionCard";
import QuickActions from "../../components/home/QuickActions";
import RecentScans from "../../components/home/RecentScans";
import HealthTip from "../../components/home/HealthTip";
import BMICard from "../home/BMICard";
import { getProfile } from "../../services/profileService";
import { useHistory } from "../../hooks/useHistory";
import { calculateNutritionSummary } from "../../utils/nutritionSummary";
import { getFavoriteIds } from "../../services/favoriteService";
import { getStoredAuthUser } from "../../utils/profileStorage";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../components/common/AppHeader";
import { getDashboard } from "../../services/dashboardService";


const RECENT_SCAN_LIMIT = 10;

type Props = {
  navigation: any;
};

type DashboardData = {
  today_calories: number;
  today_protein: number;
  today_carbs: number;
  today_fat: number;
};

export default function HomeScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
const [dashboardData, setDashboardData] =
  useState<DashboardData | null>(null);
const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
const [water, setWater] = useState(0);
  const { history, loading: historyLoading } = useHistory({
    refetchOnFocus: true,
  });


  const recentScans = useMemo(
    () => history.slice(0, RECENT_SCAN_LIMIT),
    [history]
  );

  
const loadHomeData = useCallback(async () => {
  try {
    setLoading(true);

    const [
      profileData,
      favoriteIdList,
      dashboardData,
    ] = await Promise.all([
      getProfile(),
      getFavoriteIds(),
      getDashboard(),
    ]);

    setProfile(profileData);
    setFavoriteIds(favoriteIdList);
    setDashboardData(dashboardData);

    console.log("PROFILE DATA :", profileData);
    console.log("DASHBOARD DATA :", dashboardData);

  } catch (error) {
    console.log("Home data load error:", error);
  } finally {
    setLoading(false);
  }
}, []);



const loadWater = useCallback(async () => {
  try {
    const user = await getStoredAuthUser();

    if (!user?.id) {
      setWater(0);
      return;
    }

    // User-specific storage keys
    const waterKey = `water_intake_${user.id}`;
    const waterDateKey = `water_date_${user.id}`;

    // Today's date
    const today = new Date().toDateString();

    // Get saved date
    const savedDate = await AsyncStorage.getItem(waterDateKey);

    // ------------------------------------
    // NEW DAY → RESET WATER
    // ------------------------------------
    if (savedDate !== today) {
      await AsyncStorage.setItem(waterKey, "0");
      await AsyncStorage.setItem(waterDateKey, today);

      setWater(0);

      console.log("========== WATER RESET ==========");
      console.log("User ID:", user.id);
      console.log("Previous Date:", savedDate);
      console.log("Today:", today);
      console.log("Water Reset To: 0 ml");

      return;
    }

    // ------------------------------------
    // SAME DAY → LOAD EXISTING WATER
    // ------------------------------------
    const savedWater = await AsyncStorage.getItem(waterKey);

    if (savedWater !== null) {
      setWater(Number(savedWater));
    } else {
      setWater(0);
    }

    console.log("========== WATER LOADED ==========");
    console.log("User ID:", user.id);
    console.log("Date:", today);
    console.log("Water:", savedWater ?? "0");

  } catch (error) {
    console.log("Water Load Error:", error);
    setWater(0);
  }
}, []);

useFocusEffect(
  useCallback(() => {
    loadHomeData();
    loadWater();
  }, [loadHomeData, loadWater])
);



const refreshFavorites = useCallback(async () => {
  try {
    const favoriteIdList = await getFavoriteIds();
    setFavoriteIds(favoriteIdList);
  } catch (error) {
    console.log("Failed to refresh favorites", error);
  }
}, []);

if (loading || historyLoading) {
  return (
    <SafeAreaView
      style={styles.loaderContainer}
    >
      <ActivityIndicator
        size="large"
        color="#0F8A83"
      />

    </SafeAreaView>
  );
}

return (
  <SafeAreaView
    style={styles.container}
    edges={["top"]}
  >
    <StatusBar style="dark" />

    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Header profile={profile} />

        <SearchBar navigation={navigation} />

<NutritionCard
  summary={{
    calories: dashboardData?.today_calories ?? 0,
    protein: dashboardData?.today_protein ?? 0,
    carbs: dashboardData?.today_carbs ?? 0,
    fat: dashboardData?.today_fat ?? 0,
    totalScans: 0,
  }}
  water={water}
  goal={profile?.daily_water ?? 2500}
  dailyGoals={{
    calories: profile?.daily_calories ?? 0,
    protein: profile?.daily_protein ?? 0,
    carbs: profile?.daily_carbs ?? 0,
    fat: profile?.daily_fat ?? 0,
  }}
/>

        <BMICard profile={profile} />

        <QuickActions navigation={navigation} />

        <RecentScans
          history={recentScans}
          loading={historyLoading}
          favoriteIds={favoriteIds}
          refreshFavorites={refreshFavorites}
        />

        <HealthTip />
      </ScrollView>

      {/* Floating AI Chat Button */}
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
    </View>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContainer: {
    paddingBottom: 40,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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
