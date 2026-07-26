import React, { useEffect } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import AppNavigator from "./src/navigation/AppNavigator";
import Colors from "./src/constants/colors";
import { toastConfig } from "./src/components/ToastConfig";
import { registerForPushNotifications } from "./src/services/notificationService";



function AppContent() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <StatusBar style="dark" backgroundColor={Colors.white} />
      <AppNavigator />
      <Toast
        config={toastConfig}
        position="bottom"
        bottomOffset={insets.bottom + 16}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
