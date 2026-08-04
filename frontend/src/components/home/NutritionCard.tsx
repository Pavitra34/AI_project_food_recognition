import React from "react";
import {
  View,
 Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NutritionSummary } from "../../utils/nutritionSummary";
import { useEffect, useRef } from "react";
import Toast from "react-native-toast-message";

const PRIMARY = "#0F8A83";




type Props = {
  summary: NutritionSummary | null;
  water: number;
  goal: number;

  dailyGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export default function NutritionCard({
  summary,
  water,
  goal,
  dailyGoals,
}: Props) {

  const caloriePercent =
  ((summary?.calories ?? 0) /
    (dailyGoals.calories || 1)) *
  100;

const proteinPercent =
  ((summary?.protein ?? 0) /
    (dailyGoals.protein || 1)) *
  100;

const carbPercent =
  ((summary?.carbs ?? 0) /
    (dailyGoals.carbs || 1)) *
  100;

const fatPercent =
  ((summary?.fat ?? 0) /
    (dailyGoals.fat || 1)) *
  100;

const waterPercent =
  (water / (goal || 1)) * 100;

  const toastShown = useRef(false);

  const isCaloriesExceeded = caloriePercent > 100;
const isProteinExceeded = proteinPercent > 100;
const isCarbsExceeded = carbPercent > 100;
const isFatExceeded = fatPercent > 100;
const isWaterExceeded = waterPercent > 100;

const hasGoals =
  dailyGoals.calories > 0 &&
  dailyGoals.protein > 0 &&
  dailyGoals.carbs > 0 &&
  dailyGoals.fat > 0 &&
  goal > 0;

const hasExceeded =
  hasGoals &&
  (
    isCaloriesExceeded ||
    isProteinExceeded ||
    isCarbsExceeded ||
    isFatExceeded ||
    isWaterExceeded
  );

  const getProgressColor = (
  percent: number,
  hasGoals: boolean
) => {
  if (!hasGoals) return "#D1D5DB"; // Grey

  if (percent > 100) return "#EF4444"; // Red

  if (percent >= 80) return "#F59E0B"; // Orange

  return "#10B981"; // Green
};

useEffect(() => {
  if (hasExceeded && !toastShown.current) {
    toastShown.current = true;

    Toast.show({
      type: "warning",
      text1: "⚠️ Daily Nutrition Limit Exceeded",
      text2:
        "You have exceeded one or more daily nutrition goals.",
    });
  }

  if (!hasExceeded) {
    toastShown.current = false;
  }
}, [hasExceeded]);


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

      {/* Calories */}
      <View style={styles.row}>
        <Text style={styles.label}>🔥 Calories</Text>

        <Text style={styles.value}>
          {summary?.calories ?? 0} / {dailyGoals.calories} kcal
        </Text>
      </View>

<View style={styles.progressBackground}>
  <View
    style={[
      styles.progressFill,
      {
        width: `${hasGoals ? Math.min(caloriePercent, 100) : 0}%`,
        backgroundColor: getProgressColor(
  caloriePercent,
  hasGoals
),
      },
    ]}
  />
</View>

      {/* Protein */}
      <View style={styles.row}>
        <Text style={styles.label}>🥩 Protein</Text>

        <Text style={styles.value}>
          {summary?.protein?.toFixed(1) ?? 0} / {dailyGoals.protein} g
        </Text>
      </View>

<View style={styles.progressBackground}>
  <View
    style={[
      styles.progressFill,
      {
            width: `${hasGoals ? Math.min(proteinPercent,100) : 0}%`,
backgroundColor: getProgressColor(
    proteinPercent,
    hasGoals
),
          },
        ]}
      />
</View>

      {/* Carbs */}
      <View style={styles.row}>
        <Text style={styles.label}>🍚 Carbohydrates</Text>

        <Text style={styles.value}>
          {summary?.carbs?.toFixed(1) ?? 0} / {dailyGoals.carbs} g
        </Text>
      </View>

<View style={styles.progressBackground}>
  <View
    style={[
      styles.progressFill,
      {
                   width: `${hasGoals ? Math.min(proteinPercent,100) : 0}%`,
backgroundColor: getProgressColor(
    carbPercent,
    hasGoals
),
      },
    ]}
  />
</View>

      {/* Fat */}
      <View style={styles.row}>
        <Text style={styles.label}>🥑 Fat</Text>

        <Text style={styles.value}>
          {summary?.fat?.toFixed(1) ?? 0} / {dailyGoals.fat} g
        </Text>
      </View>
<View style={styles.progressBackground}>
  <View
    style={[
      styles.progressFill,
      {
                   width: `${hasGoals ? Math.min(proteinPercent,100) : 0}%`,
backgroundColor: getProgressColor(
    fatPercent,
    hasGoals
),
      },
    ]}
  />
</View>

      {/* Water */}
      <View style={styles.row}>
        <Text style={styles.label}>💧 Water</Text>

        <Text style={styles.value}>
          {water} / {goal} ml
        </Text>
      </View>

<View style={styles.progressBackground}>
  <View
    style={[
      styles.progressFill,
      {
        width: `${hasGoals ? Math.min(waterPercent, 100) : 0}%`,
        backgroundColor: getProgressColor(
          waterPercent,
          hasGoals
        ),
      },
    ]}
  />
</View>

<Text
  style={{
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: !hasGoals
      ? "#6B7280"
      : hasExceeded
      ? "#EF4444"
      : "#10B981",
  }}
>
  {!hasGoals
    ? "Complete your profile to calculate daily nutrition goals."
    : hasExceeded
    ? "⚠️ Daily Nutrition Limit Exceeded"
    : "✅ You're on track today"}
</Text>
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
  progressBackground: {
  width: "100%",
  height: 8,
  backgroundColor: "#E5E7EB",
  borderRadius: 10,
  overflow: "hidden",
  marginBottom: 14,
},

progressFill: {
  height: "100%",
  backgroundColor: PRIMARY,
  borderRadius: 10,
},
});