import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { healthTips } from "../../screens/Data/healthTips";

export default function HealthTip() {
  const day = new Date().getDate();

  const todayTip = healthTips[day % healthTips.length];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={todayTip.icon as any}
          size={30}
          color="#F59E0B"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {todayTip.title}
        </Text>

        <Text style={styles.tip}>
          {todayTip.tip}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF7E6",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    marginLeft: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  tip: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },
});