import React from "react";
import {
  View,
 Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NutritionSummary } from "../../utils/nutritionSummary";

const PRIMARY = "#0F8A83";

type Props = {
  summary: NutritionSummary | null;
  water: number;
  goal: number;
};

export default function NutritionCard({ summary, goal, water}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Nutrition Summary
        </Text>

        <Ionicons
          name="restaurant-outline"
          size={24}
          color={PRIMARY}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>🔥 Calories</Text>
        <Text style={styles.value}>
          {summary?.calories ?? 0} kcal
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>🥩 Protein</Text>
        <Text style={styles.value}>
          {summary?.protein?.toFixed(1) ?? 0} g
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>🍚 Carbohydrates</Text>
        <Text style={styles.value}>
          {summary?.carbs?.toFixed(1) ?? 0} g
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>🥑 Fat</Text>
        <Text style={styles.value}>
          {summary?.fat?.toFixed(1) ?? 0} g
        </Text>
      </View>

<View style={styles.row}>
  <Text style={styles.label}>💧 Water</Text>

  <Text style={styles.value}>
    {water} ml / {goal} ml
  </Text>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  label: {
    fontSize: 16,
    color: "#6B7280",
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  button: {
    marginTop: 18,
    backgroundColor: PRIMARY,
    borderRadius: 14,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
});