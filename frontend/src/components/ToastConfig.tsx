import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ToastConfigParams } from "react-native-toast-message";

type ToastProps = ToastConfigParams<{ text1?: string }>;

const ToastBanner = ({
  message,
  backgroundColor,
  icon,
}: {
  message?: string;
  backgroundColor: string;
  icon: keyof typeof Ionicons.glyphMap;
}) => (
  <View style={[styles.banner, { backgroundColor }]}>
    <Ionicons name={icon} size={22} color="#FFFFFF" />
    <Text style={styles.message} numberOfLines={3}>
      {message}
    </Text>
  </View>
);

export const toastConfig = {
  success: ({ text1 }: ToastProps) => (
    <ToastBanner
      message={text1}
      backgroundColor="#2E7D32"
      icon="checkmark-circle"
    />
  ),
  error: ({ text1 }: ToastProps) => (
    <ToastBanner
      message={text1}
      backgroundColor="#C62828"
      icon="close-circle"
    />
  ),
  warning: ({ text1 }: ToastProps) => (
    <ToastBanner
      message={text1}
      backgroundColor="#F59E0B"
      icon="alert-circle"
    />
  ),
};
const styles = StyleSheet.create({
  banner: {
    width: "92%",
    minHeight: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  message: {
    flex: 1,
    marginLeft: 12,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
});

