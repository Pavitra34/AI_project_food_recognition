import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import AppHeader from "../../components/common/AppHeader";

import {
  forgotPassword,
} from "../../services/authService";

import {
  showSuccess,
  showError,
  showWarning,
} from "../../utils/toast";

const PRIMARY = "#0F8A83";

type Props = {
  navigation: any;
};

export default function ForgotPasswordScreen({
  navigation,
}: Props) {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================
  // FORGOT PASSWORD
  // =====================================

  const handleForgotPassword = async () => {

    const userEmail =
      email.trim().toLowerCase();

    if (!userEmail) {
      showWarning("Please enter your email");
      return;
    }

    try {

      setLoading(true);

      console.log("====================================");
      console.log("FORGOT PASSWORD REQUEST");
      console.log("Email :", userEmail);
      console.log("====================================");

      const response =
        await forgotPassword(userEmail);

      console.log("====================================");
      console.log("FORGOT PASSWORD RESPONSE");
      console.log(response);
      console.log("====================================");

      if (response.success) {

        showSuccess(
          "Email verified successfully"
        );

        // Backend generated reset token
        const resetToken =
          response.reset_token;

        console.log(
          "RESET TOKEN:",
          resetToken
        );

        // Go to Reset Password Screen
        navigation.navigate(
          "ResetPassword",
          {
            email: userEmail,
            resetToken: resetToken,
          }
        );

      } else {

        showError(
          response.message ||
          "Email not found"
        );

      }

    } catch (error) {

      console.log(
        "FORGOT PASSWORD ERROR:",
        error
      );

      showError(
        "Unable to connect to server"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}

      <AppHeader
        title="Forgot Password"
        showBack={true}
      />

      <View style={styles.content}>

        <View style={styles.iconContainer}>
          <Ionicons
            name="lock-open-outline"
            size={42}
            color={PRIMARY}
          />
        </View>

        <Text style={styles.title}>
          Forgot Your Password?
        </Text>

        <Text style={styles.subtitle}>
          Enter the email address associated
          with your NutriScan account. We'll
          verify your account and let you
          create a new password.
        </Text>

        {/* Email */}

        <Text style={styles.label}>
          Email Address
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

        {/* Continue */}

        <TouchableOpacity
          style={[
            styles.button,
            loading &&
              styles.buttonDisabled,
          ]}
          onPress={handleForgotPassword}
          disabled={loading}
        >

          {loading ? (

            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />

          ) : (

            <Text style={styles.buttonText}>
              Continue
            </Text>

          )}

        </TouchableOpacity>

        {/* Back to Login */}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() =>
            navigation.replace("Login")
          }
          disabled={loading}
        >
          <Text style={styles.loginText}>
            Back to Login
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    paddingTop: 28,
  },

  content: {
    paddingHorizontal: 28,
    paddingTop: 30,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E6FFFB",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#777777",
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    color: "#444444",
    marginBottom: 7,
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
    backgroundColor: "#FFFFFF",
    marginBottom: 22,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#111111",
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

  loginButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  loginText: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: "600",
  },

});