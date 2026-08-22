import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { loginUser } from "../../services/authService";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getProfile } from "../../services/profileService";

import {
  showSuccess,
  showError,
  showWarning,
} from "../../utils/toast";

const PRIMARY = "#0F8A83";

type Props = {
  navigation: any;
};

export default function LoginScreen({
  navigation,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [hidePassword, setHidePassword] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  // ================================
  // LOGIN
  // ================================

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showWarning("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      console.log("====================================");
      console.log("LOGIN REQUEST");
      console.log(
        "Email :",
        email.trim().toLowerCase()
      );
      console.log("Password :", password);
      console.log("====================================");

      const response = await loginUser(
        email.trim().toLowerCase(),
        password
      );

      console.log("====================================");
      console.log("LOGIN RESPONSE");
      console.log(response);
      console.log("====================================");

      if (response.success) {
        // ================================
        // SAVE TOKEN
        // ================================

        await AsyncStorage.setItem(
          "token",
          response.access_token
        );

        // ================================
        // SAVE USER
        // ================================

        await AsyncStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );

        // ================================
        // VERIFY STORAGE
        // ================================

        const savedToken =
          await AsyncStorage.getItem("token");

        const savedUser =
          await AsyncStorage.getItem("user");

        console.log("====================================");
        console.log("ASYNC STORAGE");
        console.log("Saved Token :", savedToken);

        console.log(
          "Saved User :",
          savedUser
            ? JSON.parse(savedUser)
            : null
        );

        console.log("====================================");

        showSuccess("Login Successfully");

        // ================================
        // GET PROFILE
        // ================================

        try {
          const profile = await getProfile();

          console.log(
            "PROFILE DATA:",
            profile
          );

          if (!profile.age) {
            navigation.replace(
              "HealthProfile"
            );
          } else {
            navigation.replace("Main");
          }
        } catch (error) {
          console.log(
            "PROFILE ERROR:",
            error
          );

          navigation.replace("Main");
        }
      } else {
        showError(
          response.message ||
            "Enter valid email and password"
        );
      }
    } catch (error: any) {
      console.log(
        "===================================="
      );

      console.log(
        "LOGIN ERROR:",
        error
      );

      console.log(
        "ERROR MESSAGE:",
        error?.message
      );

      console.log(
        "===================================="
      );

      showError(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FORGOT PASSWORD
  // ================================

const handleForgotPassword = () => {
  navigation.navigate("ForgotPassword");
};

  return (
    <SafeAreaView style={styles.container}>

      {/* ================================
          LOGO
      ================================= */}

      <Image
        source={require("../../../assets/logo.png")}
        style={styles.logo}
      />

      {/* ================================
          TITLE
      ================================= */}

      <Text style={styles.title}>
        Welcome Back
      </Text>

      <Text style={styles.subtitle}>
        Please enter your details to sign in
        to NutriScan.
      </Text>

      {/* ================================
          EMAIL
      ================================= */}

      <Text style={styles.label}>
        Email or Username
      </Text>

      <View style={styles.inputContainer}>

        <Ionicons
          name="mail-outline"
          size={20}
          color="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

      </View>

      {/* ================================
          PASSWORD
      ================================= */}

      <Text style={styles.label}>
        Password
      </Text>

      <View style={styles.inputContainer}>

        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry={hidePassword}
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() =>
            setHidePassword(
              !hidePassword
            )
          }
        >
          <Ionicons
            name={
              hidePassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={20}
            color="#999"
          />
        </TouchableOpacity>

      </View>

      {/* ================================
          FORGOT PASSWORD
      ================================= */}

      <TouchableOpacity
        style={styles.forgot}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        <Text style={styles.forgotText}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* ================================
          LOGIN BUTTON
      ================================= */}

      <TouchableOpacity
        style={[
          styles.button,
          loading &&
            styles.buttonDisabled,
        ]}
        onPress={handleLogin}
        disabled={loading}
      >

        {loading ? (
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
          />
        ) : (
          <Text style={styles.buttonText}>
            Sign In
          </Text>
        )}

      </TouchableOpacity>

      {/* ================================
          REGISTER
      ================================= */}

      <View style={styles.bottom}>

        <Text style={styles.bottomText}>
          New to NutriScan?
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              "Register"
            )
          }
        >
          <Text style={styles.register}>
            Create account
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
    paddingTop: 25,
  },

  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    color: "#111111",
  },

  subtitle: {
    textAlign: "center",
    color: "#777777",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 22,
  },

  label: {
    fontSize: 14,
    color: "#444444",
    marginBottom: 6,
    marginTop: 4,
    fontWeight: "600",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#111111",
  },

  forgot: {
    alignSelf: "flex-end",
    marginBottom: 35,
  },

  forgotText: {
    color: PRIMARY,
    fontWeight: "600",
  },

  button: {
    backgroundColor: PRIMARY,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35,
  },

  bottomText: {
    color: "#666666",
  },

  register: {
    color: PRIMARY,
    fontWeight: "700",
    marginLeft: 5,
  },

});