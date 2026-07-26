import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/home/HomeScreen";
import FavouriteScreen from "../screens/favourite/FavouriteScreen";
import HistoryScreen from "../screens/history/HistoryScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const PRIMARY = "#0F8A83";

export default function BottomTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: "#9CA3AF",

        tabBarStyle: {
          //position: "absolute",
          left: 16,
          right: 16,
          bottom: insets.bottom + 10,
        tabBarHideOnKeyboard: true,
          height: 70,
          borderRadius: 20,

          paddingTop: 6,
          paddingBottom: 8,

          backgroundColor: "#FFFFFF",

          elevation: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;

            case "Favourite":
              iconName = "heart";
              break;

            case "History":
              iconName = "time";
              break;

            case "Profile":
              iconName = "person";
              break;

            default:
              iconName = "ellipse";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Favourite"
        component={FavouriteScreen}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
      
    </Tab.Navigator>
  );
}