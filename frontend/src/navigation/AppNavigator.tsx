import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/splash/SplashScreen";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import AuthNavigator from "./AuthNavigator";
import BottomTabs from "./BottomTabs";
import HealthProfileScreen from "../screens/auth/HealthProfileScreen";
import ScanScreen from "../screens/scan/ScanScreen";
import FoodDetailsScreen from "../screens/home/FoodDetailsScreen";
import FavoriteScreen from "../screens/favourite/FavouriteScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import UpdateBMIScreen from "../screens/profile/UpdateBMIScreen";
import WaterReminderScreen from "../screens/home/WaterReminderScreen";
import NotificationScreen from "../screens/home/NotificationScreen";
import ChatScreen from "../screens/chat/ChatScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />

        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
        />

        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
        />
        <Stack.Screen
          name="HealthProfile"
          component={HealthProfileScreen}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
        />
          <Stack.Screen
    name="Scan"
    component={ScanScreen}
  />
<Stack.Screen
  name="FoodDetails"
  component={FoodDetailsScreen}
  options={{
    headerShown: false,
  }}
/>
<Stack.Screen
  name="EditProfile"
  component={EditProfileScreen}
/>
<Stack.Screen
  name="UpdateBMI"
  component={UpdateBMIScreen}
/>
<Stack.Screen
  name="Favorite"
  component={FavoriteScreen}
/>
<Stack.Screen
  name="WaterReminder"
  component={WaterReminderScreen}
  options={{
    headerShown: false,
  }}
/>
<Stack.Screen
  name="Notification"
  component={NotificationScreen}
/>
<Stack.Screen
  name="Chat"
  component={ChatScreen}
  options={{
    headerShown: false,
  }}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}