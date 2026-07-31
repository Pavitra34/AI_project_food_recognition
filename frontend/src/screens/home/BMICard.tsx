import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const PRIMARY = "#0F8A83";

type Props = {
  profile: {
    bmi: number;
    bmi_category: string;
    goal: string;
    activity_level: string;
    health_condition: string;
  } | null;
};

export default function BMICard({
  profile,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Health Summary
        </Text>

        <Ionicons
          name="fitness-outline"
          size={24}
          color={PRIMARY}
        />
      </View>

      <View style={styles.row}>
  <Text style={styles.label}>BMI</Text>
  <Text style={styles.value}>
    {profile?.bmi?.toFixed(2) ?? "--"}
  </Text>
</View>

<View style={styles.row}>
  <Text style={styles.label}>Category</Text>
  <Text style={styles.value}>
    {profile?.bmi_category ?? "--"}
  </Text>
</View>

<View style={styles.row}>
  <Text style={styles.label}>Goal</Text>
  <Text style={styles.value}>
    {profile?.goal ?? "--"}
  </Text>
</View>

{/* ✅ Health Condition */}
<View style={styles.row}>
  <Text style={styles.label}>Health Condition</Text>
  <Text style={styles.value}>
    {profile?.health_condition ?? "Healthy"}
  </Text>
</View>

<View style={styles.row}>
  <Text style={styles.label}>Activity</Text>
  <Text style={styles.value}>
    {profile?.activity_level ?? "--"}
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
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
});