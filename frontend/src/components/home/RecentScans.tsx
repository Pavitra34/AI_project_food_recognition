import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import FoodCard from "../../components/common/FoodCard";
import type { ScanHistoryItem } from "../../types/history";
import { getScanKey } from "../../utils/scanItem";

type Props = {
  history: ScanHistoryItem[];
  loading?: boolean;
  favoriteIds: number[];
  refreshFavorites: () => void;
};

export default function RecentScans({
  history,
  loading = false,
  favoriteIds,
  refreshFavorites,
}: Props) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Recent Scans</Text>

        <TouchableOpacity onPress={() => navigation.navigate("History")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading && history.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#0F8A83" />
        </View>
      ) : (
        <FlatList
          horizontal
          data={history}
          renderItem={({ item }) => (
<FoodCard
  item={item}
  variant="horizontal"
  isFavorite={favoriteIds.includes(item.scan_id)}
  onFavoriteChanged={refreshFavorites}
  onPress={() =>
    navigation.navigate("FoodDetails", {
      food: item,
    })
  }
/>
          )}
          keyExtractor={(item, index) => getScanKey(item, index)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No scans yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 40,
  },

  header: {
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  seeAll: {
    color: "#0F8A83",
    fontWeight: "700",
    fontSize: 15,
  },

  listContent: {
    paddingRight: 20,
    paddingBottom: 15,
  },

  loader: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
  },

  emptyText: {
    color: "#9CA3AF",
    fontSize: 16,
  },
});
