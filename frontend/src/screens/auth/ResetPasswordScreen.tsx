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
  resetPassword,
} from "../../services/authService";

import {
  showSuccess,
  showError,
  showWarning,
} from "../../utils/toast";

const PRIMARY = "#0F8A83";

type Props = {
  navigation: any;
  route: any;
};

export default function ResetPasswordScreen({
  navigation,
  route,
}: Props) {

  const email =
    route?.params?.email || "";

  const resetToken =
    route?.params?.resetToken || "";

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [hideNewPassword, setHideNewPassword] =
    useState(true);

  const [
    hideConfirmPassword,
    setHideConfirmPassword,
  ] = useState(true);

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // RESET PASSWORD
  // =====================================

  const handleResetPassword = async () => {

    if (
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      showWarning(
        "Please fill all fields"
      );
      return;
    }

    if (newPassword.length < 8) {
      showWarning(
        "Password must be at least 8 characters"
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      showWarning(
        "Passwords do not match"
      );
      return;
    }

    if (!email || !resetToken) {

      showError(
        "Invalid password reset session"
      );

      return;
    }

    try {

      setLoading(true);

      console.log("====================================");
      console.log("RESET PASSWORD REQUEST");
      console.log("Email :", email);
      console.log(
        "Reset Token :",
        resetToken
      );
      console.log("====================================");

      const response =
        await resetPassword(
          email,
          resetToken,
          newPassword,
          confirmPassword
        );

      console.log("====================================");
      console.log(
        "RESET PASSWORD RESPONSE"
      );
      console.log(response);
      console.log("====================================");

      if (response.success) {

        showSuccess(
          "Password reset successfully"
        );

        setNewPassword("");
        setConfirmPassword("");

        // Go back to Login
        navigation.replace("Login");

      } else {

        showError(
          response.message ||
          "Unable to reset password"
        );

      }

    } catch (error) {

      console.log(
        "RESET PASSWORD ERROR:",
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
        title="Reset Password"
        showBack={true}
      />

      <View style={styles.content}>

        <Text style={styles.title}>
          Create New Password
        </Text>

        <Text style={styles.subtitle}>
          Create a new password for your
          NutriScan account.
        </Text>

        {/* Verified Email */}

        <View style={styles.emailBox}>

          <Ionicons
            name="mail-outline"
            size={19}
            color={PRIMARY}
          />

          <Text
            style={styles.emailText}
            numberOfLines={1}
          >
            {email}
          </Text>

          <Ionicons
            name="checkmark-circle"
            size={20}
            color={PRIMARY}
          />

        </View>

        {/* New Password */}

        <Text style={styles.label}>
          New Password
        </Text>

        <View style={styles.inputContainer}>

          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#999"
            secureTextEntry={
              hideNewPassword
            }
            autoCapitalize="none"
            autoCorrect={false}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TouchableOpacity
            onPress={() =>
              setHideNewPassword(
                !hideNewPassword
              )
            }
          >

            <Ionicons
              name={
                hideNewPassword
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={20}
              color="#999"
            />

          </TouchableOpacity>

        </View>

        {/* Confirm Password */}

        <Text style={styles.label}>
          Confirm New Password
        </Text>

        <View style={styles.inputContainer}>

          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor="#999"
            secureTextEntry={
              hideConfirmPassword
            }
            autoCapitalize="none"
            autoCorrect={false}
            value={confirmPassword}
            onChangeText={
              setConfirmPassword
            }
          />

          <TouchableOpacity
            onPress={() =>
              setHideConfirmPassword(
                !hideConfirmPassword
              )
            }
          >

            <Ionicons
              name={
                hideConfirmPassword
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={20}
              color="#999"
            />

          </TouchableOpacity>

        </View>

        {/* Password Requirement */}

        <View
          style={styles.requirementBox}
        >

          <Ionicons
            name="information-circle-outline"
            size={19}
            color={PRIMARY}
          />

          <Text
            style={styles.requirementText}
          >
            Password must contain at least
            8 characters.
          </Text>

        </View>

        {/* Reset Password */}

        <TouchableOpacity
          style={[
            styles.button,
            loading &&
              styles.buttonDisabled,
          ]}
          onPress={
            handleResetPassword
          }
          disabled={loading}
        >

          {loading ? (

            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />

          ) : (

            <Text style={styles.buttonText}>
              Reset Password
            </Text>

          )}

        </TouchableOpacity>

        {/* Cancel */}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() =>
            navigation.replace("Login")
          }
          disabled={loading}
        >

          <Text style={styles.cancelText}>
            Cancel
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
    paddingTop: 25,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#777777",
    lineHeight: 21,
    marginBottom: 22,
  },

  emailBox: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6FFFB",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 25,
  },

  emailText: {
    flex: 1,
    marginLeft: 9,
    marginRight: 8,
    color: "#334155",
    fontSize: 14,
    fontWeight: "500",
  },

  label: {
    fontSize: 14,
    color: "#444444",
    marginBottom: 7,
    marginTop: 5,
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
    marginBottom: 17,
    backgroundColor: "#FFFFFF",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#111111",
  },

  requirementBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 25,
  },

  requirementText: {
    marginLeft: 7,
    color: "#64748B",
    fontSize: 13,
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

  cancelButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  cancelText: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: "600",
  },

});