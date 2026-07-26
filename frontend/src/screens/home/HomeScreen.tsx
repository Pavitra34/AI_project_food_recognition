import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
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

const RECENT_SCAN_LIMIT = 10;

type Props = {
  navigation: any;
};


export default function HomeScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
const [water, setWater] = useState(0);
  const { history, loading: historyLoading } = useHistory({
    refetchOnFocus: true,
  });

  const nutritionSummary = useMemo(
    () => calculateNutritionSummary(history),
    [history]
  );

  const recentScans = useMemo(
    () => history.slice(0, RECENT_SCAN_LIMIT),
    [history]
  );

  
const loadHomeData = useCallback(async () => {
  try {
    setLoading(true);

    const [profileData, favoriteIdList] = await Promise.all([
      getProfile(),
      getFavoriteIds(),
    ]);

    setProfile(profileData);
    setFavoriteIds(favoriteIdList);
  } catch (error) {
    console.log("Home data load error:", error);
  } finally {
    setLoading(false);
  }
}, []);

useFocusEffect(
  useCallback(() => {
    const loadWater = async () => {
      try {
        const savedWater = await AsyncStorage.getItem("water_intake");

        if (savedWater) {
          setWater(Number(savedWater));
        } else {
          setWater(0);
        }
      } catch (error) {
        console.log("Failed to load water:", error);
      }
    };

    loadHomeData();
    loadWater();
  }, [loadHomeData])
);

const refreshFavorites = useCallback(async () => {
  try {
    const favoriteIdList = await getFavoriteIds();
    setFavoriteIds(favoriteIdList);
  } catch (error) {
    console.log("Failed to refresh favorites", error);
  }
}, []);

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [loadHomeData])
  );

if (loading) {
  return (
    <SafeAreaView style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0F8A83" />
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Header profile={profile} />
        <SearchBar navigation={navigation} />
        <NutritionCard
  summary={nutritionSummary}
  water={water}
  goal={2500}
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
});
