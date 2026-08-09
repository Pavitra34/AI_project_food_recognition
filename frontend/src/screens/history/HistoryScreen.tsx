import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../../components/common/AppHeader";
import FoodCard from "../../components/common/FoodCard";
import { useHistory } from "../../hooks/useHistory";
import { Ionicons } from "@expo/vector-icons";

export default function HistoryScreen({ navigation }: any) {
  const { history, loading, error, refresh } = useHistory({
    refetchOnFocus: true,
  });
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh(true);
    setRefreshing(false);
  }, [refresh]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader title="Scan History" showBack={false} />

      <Text style={styles.subtitle}>
        {history.length} Scan{history.length !== 1 ? "s" : ""}
      </Text>

      {loading && history.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0F8A83" />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.scan_id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <FoodCard
              item={item}
              variant="vertical"
              onPress={() =>
                navigation.navigate("FoodDetails", { food: item })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {error ?? "No Scan History"}
              </Text>
              <Text style={styles.emptySub}>
                {error
                  ? "Pull down to try again."
                  : "Scan a food to see your history here."}
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

  subtitle: {
    marginTop: 2,
    marginHorizontal: 20,
    color: "#6B7280",
    fontSize: 14,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    marginTop: 80,
    alignItems: "center",
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
