import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  navigation: any;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>

      {/* Logo */}

      <Image
        source={require("../../../assets/logo.png")}
        style={styles.logo}
      />

      {/* Description */}

      <Text style={styles.description}>
        Recognize food instantly using AI and{"\n"}
        receive personalized nutrition advice.
      </Text>

      {/* Get Started */}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.primaryText}>
          Get started
        </Text>
      </TouchableOpacity>

      {/* Login */}

      <TouchableOpacity
        style={styles.outlineButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.outlineText}>
          Sign in
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Scan food · Track nutrition · Stay healthy
      </Text>

    </SafeAreaView>
  );
}

const PRIMARY = "#0F8A83";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 70,
  },

  logo: {
    width: 170,
    height: 170,
    resizeMode: "contain",
    marginBottom: 18,
  },

  description: {
    textAlign: "center",
    fontSize: 15,
    color: "#333",
    lineHeight: 23,
    marginBottom: 45,
  },

  primaryButton: {
    width: "100%",
    height: 56,
    backgroundColor: PRIMARY,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  outlineButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  outlineText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    marginTop: 28,
    color: "#B5B5B5",
    fontSize: 11,
  },
});