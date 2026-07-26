import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { registerUser } from "../../services/authService";
import { ActivityIndicator } from "react-native";

import {
  showSuccess,
  showError,
  showWarning,
} from "../../utils/toast";

const PRIMARY = "#0F8A83";

type Props = {
  navigation: any;
};

export default function RegisterScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] =
    useState(true);
    const [loading, setLoading] = useState(false);
    const emailRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);


const [errors, setErrors] = useState({
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

   const handleRegister = async () => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const phoneRegex =
    /^(?:0|94|\+94)?7[01245678][0-9]{7}$/;

  const newErrors = {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  // Full Name
  if (!fullName.trim()) {
    newErrors.fullName = "Full name is required";
  }

  // Email
  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(email.trim())) {
    newErrors.email = "Please enter a valid email address";
  }

  // Phone
  if (!phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!phoneRegex.test(phone.trim())) {
    newErrors.phone = "Please enter a valid phone number";
  }

  // Password
  if (!password) {
    newErrors.password = "Password is required";
  } else if (password.length < 8) {
    newErrors.password =
      "Password must be at least 8 characters";
  }

  // Confirm Password
  if (!confirmPassword) {
    newErrors.confirmPassword =
      "Confirm password is required";
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword =
      "Passwords do not match";
  }

  setErrors(newErrors);

  // Stop if any validation error exists
  if (
    Object.values(newErrors).some(
      (error) => error !== ""
    )
  ) {
    return;
  }

  try {

    setLoading(true);

    const data = {
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      confirm_password: confirmPassword,
    };

    console.log("========== REGISTER ==========");
    console.log(data);

    const response = await registerUser(data);

    console.log(response);

    if (response.success) {

      showSuccess("Registration Successful");

      setTimeout(() => {
        navigation.replace("Login");
      }, 1200);

    } else {

      // Backend duplicate validations
      if (response.message === "Email already exists") {

        setErrors((prev) => ({
          ...prev,
          email: response.message,
        }));

      } else if (
        response.message ===
        "Phone number already exists"
      ) {

        setErrors((prev) => ({
          ...prev,
          phone: response.message,
        }));

      } else {

        showError(response.message);

      }

    }

  } catch (error: any) {

    console.log(error);

    showError("Unable to connect server");

  } finally {

    setLoading(false);

  }

};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>

<TouchableOpacity
  onPress={() => navigation.goBack()}
  style={styles.backButton}
>
  <Ionicons
    name="arrow-back"
    size={28}
    color="#222"
  />
</TouchableOpacity>

<Text style={styles.title}>
  Create Account
</Text>

<View style={{ width: 40 }} />

</View>

<KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={
        Platform.OS === "ios"
            ? "padding"
            : "height"
    }
>

<ScrollView
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="interactive"
    contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 60,
    }}
    automaticallyAdjustKeyboardInsets={true}
>
        {/* Back */}
        

<Image
source={require("../../../assets/logo.png")}
style={styles.logo}
/>

<Text style={styles.subtitle}>
Start your healthy journey with NutriScan and
make smarter food choices every day.
</Text>

        {/* Full Name */}
<View>
  <View
    style={[
      styles.inputContainer,
      errors.fullName
        ? {
            borderColor: "#EF4444",
            borderWidth: 2,
          }
        : focusedField === "fullName"
        ? {
            borderColor: PRIMARY,
            borderWidth: 2,
          }
        : null,
    ]}
  >
    <Ionicons
      name="person-outline"
      size={20}
      color="#999"
    />

    <TextInput
      style={styles.input}
      placeholder="John Doe"
      placeholderTextColor="#999"
      value={fullName}
      onChangeText={(text) => {
  setFullName(text);

  setErrors((prev) => ({
    ...prev,
    fullName: "",
  }));
}}
      autoCapitalize="words"
      autoCorrect={false}
      returnKeyType="next"
      submitBehavior="submit"
      onSubmitEditing={() => emailRef.current?.focus()}
      onFocus={() => setFocusedField("fullName")}
      onBlur={() => setFocusedField("")}
    />
  </View>

  {errors.fullName !== "" && (
    <Text style={styles.errorText}>
      {errors.fullName}
    </Text>
  )}
</View>

        {/* Email */}

       <View>
  <View
    style={[
      styles.inputContainer,
      errors.email
        ? {
            borderColor: "#EF4444",
            borderWidth: 2,
          }
        : focusedField === "email"
        ? {
            borderColor: PRIMARY,
            borderWidth: 2,
          }
        : null,
    ]}
  >
    <Ionicons
      name="mail-outline"
      size={20}
      color="#999"
    />

    <TextInput
      style={styles.input}
      placeholder="john@gmail.com"
      placeholderTextColor="#999"
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      value={email}
      ref={emailRef}
      onChangeText={(text) => {
  setEmail(text);

  setErrors((prev) => ({
    ...prev,
    email: "",
  }));
}}
      returnKeyType="next"
      submitBehavior="submit"
      onSubmitEditing={() => phoneRef.current?.focus()}
      onFocus={() => setFocusedField("email")}
      onBlur={() => setFocusedField("")}
    />
  </View>

  {errors.email !== "" && (
    <Text style={styles.errorText}>
      {errors.email}
    </Text>
  )}
</View>

        {/* Phone */}
<View>
  <View
    style={[
      styles.inputContainer,
      errors.phone
        ? {
            borderColor: "#EF4444",
            borderWidth: 2,
          }
        : focusedField === "phone"
        ? {
            borderColor: PRIMARY,
            borderWidth: 2,
          }
        : null,
    ]}
  >
    <Ionicons
      name="call-outline"
      size={20}
      color="#999"
    />

    <TextInput
      style={styles.input}
      placeholder="0771234567"
      placeholderTextColor="#999"
      keyboardType="phone-pad"
      value={phone}
      ref={phoneRef}
     onChangeText={(text) => {
  setPhone(text);

  setErrors((prev) => ({
    ...prev,
    phone: "",
  }));
}}
      returnKeyType="next"
      submitBehavior="submit"
      onSubmitEditing={() => passwordRef.current?.focus()}
      onFocus={() => setFocusedField("phone")}
      onBlur={() => setFocusedField("")}
    />
  </View>

  {errors.phone !== "" && (
    <Text style={styles.errorText}>
      {errors.phone}
    </Text>
  )}
</View>

        {/* Password */}
      <View>
  <View
    style={[
      styles.inputContainer,
      errors.password
        ? {
            borderColor: "#EF4444",
            borderWidth: 2,
          }
        : focusedField === "password"
        ? {
            borderColor: PRIMARY,
            borderWidth: 2,
          }
        : null,
    ]}
  >
    <Ionicons
      name="lock-closed-outline"
      size={20}
      color="#999"
    />

    <TextInput
      style={styles.input}
      placeholder="********"
      placeholderTextColor="#999"
      secureTextEntry={hidePassword}
      value={password}
      ref={passwordRef}
      onChangeText={(text) => {
  setPassword(text);

  setErrors((prev) => ({
    ...prev,
    password: "",
  }));
}}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="next"
      submitBehavior="submit"
      onSubmitEditing={() =>
        confirmPasswordRef.current?.focus()
      }
      onFocus={() => setFocusedField("password")}
      onBlur={() => setFocusedField("")}
    />

    <TouchableOpacity
      onPress={() => setHidePassword(!hidePassword)}
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

  {errors.password !== "" && (
    <Text style={styles.errorText}>
      {errors.password}
    </Text>
  )}
</View>

        {/* Confirm Password */}

        <View>
  <View
    style={[
      styles.inputContainer,
      errors.confirmPassword
        ? {
            borderColor: "#EF4444",
            borderWidth: 2,
          }
        : focusedField === "confirmPassword"
        ? {
            borderColor: PRIMARY,
            borderWidth: 2,
          }
        : null,
    ]}
  >
    <Ionicons
      name="lock-closed-outline"
      size={20}
      color="#999"
    />

    <TextInput
      style={styles.input}
      placeholder="********"
      placeholderTextColor="#999"
      secureTextEntry={hideConfirmPassword}
      value={confirmPassword}
      ref={confirmPasswordRef}
      onChangeText={(text) => {
  setConfirmPassword(text);

  setErrors((prev) => ({
    ...prev,
    confirmPassword: "",
  }));
}}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="done"
      submitBehavior="submit"
      onSubmitEditing={Keyboard.dismiss}
      onFocus={() => setFocusedField("confirmPassword")}
      onBlur={() => setFocusedField("")}
    />

    <TouchableOpacity
      onPress={() =>
        setHideConfirmPassword(!hideConfirmPassword)
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

  {errors.confirmPassword !== "" && (
    <Text style={styles.errorText}>
      {errors.confirmPassword}
    </Text>
  )}
</View>
        {/* Button */}

<TouchableOpacity
  style={styles.button}
  onPress={handleRegister}
  disabled={loading}
>
  {loading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.buttonText}>
      Create My Account
    </Text>
  )}
</TouchableOpacity>

        {/* Bottom */}

        <View style={styles.bottom}>
          <Text style={styles.bottomText}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.replace("Login")
            }
          >
            <Text style={styles.login}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#fff",
},

backButton:{
  width:40,
  height:40,
  justifyContent:"center",
  alignItems:"center",
  marginTop:26,
  marginBottom:26,
},

headerRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 15,
  paddingHorizontal: 18,
},

title: {
  flex: 1,
  textAlign: "center",
  fontSize: 24,
  fontWeight: "700",
  color: "#111",
},

logo: {
  width: 110,
  height: 110,
  resizeMode: "contain",
  alignSelf: "center",
  marginTop: 1,
  marginBottom: 15,
},

subtitle:{
textAlign:"center",
color:"#777",
fontSize:14,
lineHeight:22,
paddingHorizontal:35,
marginTop:8,
marginBottom:20,
},

label:{
marginHorizontal:28,
fontSize:14,
fontWeight:"600",
color:"#444",
marginBottom:6,
marginTop:4,
},

inputContainer:{
marginHorizontal:28,
height:56,
borderRadius:15,
borderWidth:1,
borderColor:"#DDD",
flexDirection:"row",
alignItems:"center",
paddingHorizontal:15,
marginBottom:12,
},

input:{
flex:1,
marginLeft:10,
fontSize:15,
},

button: {
  marginHorizontal: 28,
  marginTop: 20,
  height: 56,
  borderRadius: 28,
  backgroundColor: PRIMARY,
  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 5,
  },

  elevation: 6,
},

buttonText:{
color:"#fff",
fontSize:17,
fontWeight:"700",
},

bottom:{
flexDirection:"row",
justifyContent:"center",
marginTop:30,
},

bottomText:{
color:"#666",
},

login:{
color:PRIMARY,
fontWeight:"700",
marginLeft:5,
},
errorText: {
  color: "#EF4444",
  fontSize: 12,
  marginLeft: 30,
  marginBottom: 12,
},

});