import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { loginUser } from "../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile } from "../../services/profileService";
import { saveUserProfile } from "../../utils/profileStorage";
import {
  showSuccess,
  showError,
  showWarning,
} from "../../utils/toast";
const PRIMARY = "#0F8A83";

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
    showWarning("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    console.log("====================================");
    console.log("LOGIN REQUEST");
    console.log("Email :", email.trim().toLowerCase());
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

      // Save Token
      await AsyncStorage.setItem(
        "token",
        response.access_token
      );

      // Save User
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      // Verify Saved Data
      const savedToken = await AsyncStorage.getItem("token");
      const savedUser = await AsyncStorage.getItem("user");

      console.log("====================================");
      console.log("ASYNC STORAGE");
      console.log("Saved Token :", savedToken);
      console.log(
        "Saved User :",
        savedUser ? JSON.parse(savedUser) : null
      );
      console.log("====================================");

showSuccess("Login Successfully");

try {
  const profile = await getProfile();

  console.log("PROFILE DATA:", profile);

  if (!profile.age) {
    navigation.replace("HealthProfile");
  } else {
    navigation.replace("Main");
  }
} catch (error) {
  console.log(error);
  navigation.replace("Main");
}

    } else {

      showError(
        response.message ||
          "Enter valid email and password"
      );

    }

  } catch (error: any) {

    console.log("====================================");
    console.log("LOGIN ERROR");
    console.log(error);
    console.log(error?.message);
    console.log("====================================");

    showError("Unable to connect to server");

  } finally {

    setLoading(false);

  }
  
};

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../../assets/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.subtitle}>
        Please enter your details to sign in to NutriScan.
      </Text>

      {/* Email */}

      <Text style={styles.label}>Email or Username</Text>

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
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}

      <Text style={styles.label}>Password</Text>

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
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() =>
            setHidePassword(!hidePassword)
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

      {/* Forgot */}

      <TouchableOpacity
        style={styles.forgot}
      >
        <Text style={styles.forgotText}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Login */}

      <TouchableOpacity
    style={styles.button}
    onPress={handleLogin}
    disabled={loading}
>
<Text style={styles.buttonText}>
    {loading ? "Signing In..." : "Sign In"}
</Text>
      </TouchableOpacity>

      {/* Register */}

      <View style={styles.bottom}>
        <Text style={styles.bottomText}>
          New to NutriScan?
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Register")
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
    backgroundColor: "#fff",
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
    color: "#111",
  },

  subtitle:{
    textAlign:"center",
    color:"#777",
    marginTop:10,
    marginBottom:20,
    fontSize:14,
    lineHeight:22,
},

label:{
  fontSize:14,
  color:"#444",
  marginBottom:6,
  marginTop:4,
  fontWeight:"600",
},

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#111",
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

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35,
  },

  bottomText: {
    color: "#666",
  },

  register: {
    color: PRIMARY,
    fontWeight: "700",
    marginLeft: 5,
  },
});