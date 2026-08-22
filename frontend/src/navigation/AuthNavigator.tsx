import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HealthProfileScreen from "../screens/auth/HealthProfileScreen";
import ScanScreen from "../screens/scan/ScanScreen";
import HistoryScreen from "../screens/history/HistoryScreen";
import FoodDetailsScreen from "../screens/home/FoodDetailsScreen";
import WaterReminderScreen from "../screens/home/WaterReminderScreen";
import NotificationScreen from "../screens/home/NotificationScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import PrecautionsScreen from "../screens/home/PrecautionsScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ChangePasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";


const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />
      <Stack.Screen
  name="HealthProfile"
  component={HealthProfileScreen}
  options={{ headerShown: false }}
/>
  <Stack.Screen
    name="Scan"
    component={ScanScreen}
  />
  <Stack.Screen
    name="History"
    component={HistoryScreen}
/>
<Stack.Screen
  name="FoodDetails"
  component={FoodDetailsScreen}
  options={{
    headerShown: false,
  }}
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
<Stack.Screen
  name="Precautions"
  component={PrecautionsScreen}
/>
<Stack.Screen
  name="ForgotPassword"
  component={ForgotPasswordScreen}
  options={{
    headerShown: false,
  }}
/>
<Stack.Screen
  name="ResetPassword"
  component={ResetPasswordScreen}
  options={{
    headerShown: false,
  }}
/>
  
    </Stack.Navigator>
    


    
  );
}