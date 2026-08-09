import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import AppHeader from "../../components/common/AppHeader";
import FoodCard from "../../components/common/FoodCard";
import {
  getFavorites,
  removeFavorite,
} from "../../services/favoriteService";
import type { ScanHistoryItem } from "../../types/history";
import { getScanId, getScanKey } from "../../utils/scanItem";

export default function FavouriteScreen({ navigation }: any) {
  const [favorites, setFavorites] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = useCallback(async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.log("Failed to load favorites", error);
      setFavorites([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadFavorites();
    }, [loadFavorites])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadFavorites();
  }, [loadFavorites]);

  const removeFromList = useCallback((item: ScanHistoryItem) => {
    const scanId = getScanId(item);
    setFavorites((current) =>
      current.filter((favorite) => getScanId(favorite) !== scanId)
    );
  }, []);

  const handleDeleteFavorite = useCallback(
    async (item: ScanHistoryItem) => {
      try {
        await removeFavorite(getScanId(item));
        removeFromList(item);
      } catch (error) {
        console.log("Failed to remove favorite", error);
      }
    },
    [removeFromList]
  );

  const headerRight = (
    <View style={styles.headerIcon}>
      <Ionicons name="heart" size={22} color="#EF4444" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader
        title="My Favorites"
        showBack={false}
        rightComponent={headerRight}
      />

      <Text style={styles.subtitle}>
        {favorites.length} Saved Food{favorites.length !== 1 ? "s" : ""}
      </Text>

      {loading && favorites.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0F8A83" />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => getScanKey(item, index)}
          renderItem={({ item }) => (
            <FoodCard
              item={item}
              variant="vertical"
              isFavorite
              onFavoriteChanged={() => removeFromList(item)}
              onDelete={() => handleDeleteFavorite(item)}
              onPress={() =>
                navigation.navigate("FoodDetails", { food: item })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={
            favorites.length === 0
              ? styles.emptyListContent
              : styles.listContent
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyIconWrap}>
                <Ionicons
                  name="heart-outline"
                  size={48}
                  color="#0F8A83"
                />
              </View>

              <Text style={styles.emptyTitle}>No Favorites Yet</Text>
              <Text style={styles.emptySub}>
                Foods you mark as favorites will appear here.
              </Text>
            </View>
          }
        />
      )}
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

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },

  subtitle: {
    marginTop: 2,
    marginHorizontal: 20,
    color: "#6B7280",
    fontSize: 14,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },

  emptyListContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 80,
  },

  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E6F6F4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#374151",
  },

  emptySub: {
    marginTop: 8,
    color: "#9CA3AF",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
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
