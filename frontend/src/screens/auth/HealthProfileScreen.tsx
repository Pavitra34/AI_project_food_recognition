import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { updateProfile } from "../../services/profileService";
import { showError, showSuccess } from "../../utils/toast";

const PRIMARY = "#0F8A83";

export default function HealthProfileScreen({
  
  navigation,
}: any) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [activityLevel, setActivityLevel] =
    useState("");
    const [healthCondition, setHealthCondition] = useState("Healthy");


  const validate = async () => {
    if (
      !age ||
      !gender ||
      !height ||
      !weight ||
      !goal ||
      !activityLevel
    ) {
      showError("Please fill all fields");
      return;
    }

const profileData = {
  age: Number(age),
  gender,
  height: Number(height),
  weight: Number(weight),
  goal,
  activity_level: activityLevel,
  health_condition: healthCondition,
};

    try {
      await updateProfile(profileData);

      showSuccess("Profile updated successfully");

      setTimeout(() => {
        navigation.replace("Main");
      }, 500);
    } catch (error) {
      console.log(error);
      showError("Failed to update profile");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        keyboardVerticalOffset={20}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* ---------- Header ---------- */}

          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() =>
                navigation.goBack()
              }
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color="#111827"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.replace("Main")
              }
            >
              <Text style={styles.skip}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>

          {/* ---------- Hero ---------- */}

          <View style={styles.hero}>
            <View style={styles.heroCircle}>
              <Ionicons
                name="fitness"
                size={34}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.title}>
              Complete Your{"\n"}
              Health Profile
            </Text>

            <Text style={styles.subtitle}>
              Complete your profile to
              calculate BMI, daily calories,
              water intake and receive
              personalized nutrition
              recommendations.
            </Text>

            {/* Progress */}

            <View
              style={styles.progressContainer}
            >
              <View
                style={styles.progressBackground}
              >
                <View
                  style={styles.progressFill}
                />
              </View>

              <Text
                style={styles.progressText}
              >
                Step 2 of 2
              </Text>
            </View>
          </View>

                   {/* ---------- Gender ---------- */}

          <Text style={styles.sectionTitle}>
            Gender
          </Text>

          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderCard,
                gender === "Male" &&
                  styles.selectedCard,
              ]}
              onPress={() =>
                setGender("Male")
              }
            >
              <Ionicons
                name="male"
                size={32}
                color={
                  gender === "Male"
                    ? "#FFFFFF"
                    : PRIMARY
                }
              />

              <Text
                style={[
                  styles.genderText,
                  gender === "Male" &&
                    styles.selectedText,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderCard,
                gender === "Female" &&
                  styles.selectedCard,
              ]}
              onPress={() =>
                setGender("Female")
              }
            >
              <Ionicons
                name="female"
                size={32}
                color={
                  gender === "Female"
                    ? "#FFFFFF"
                    : PRIMARY
                }
              />

              <Text
                style={[
                  styles.genderText,
                  gender === "Female" &&
                    styles.selectedText,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>

          {/* ---------- Age ---------- */}

          <Text style={styles.sectionTitle}>
            Age
          </Text>

          <View style={styles.inputCard}>
            <Ionicons
              name="calendar-outline"
              size={22}
              color={PRIMARY}
            />

            <TextInput
              placeholder="Enter your age"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              placeholderTextColor="#9CA3AF"
              style={styles.textInput}
            />
          </View>

          {/* ---------- Height & Weight ---------- */}

          <View style={styles.measurementRow}>
            <View style={styles.measurementBox}>
              <Text
                style={styles.smallTitle}
              >
                Height
              </Text>

              <View
                style={styles.inputCard}
              >
                <Ionicons
                  name="resize-outline"
                  size={22}
                  color={PRIMARY}
                />

                <TextInput
                  placeholder="cm"
                  keyboardType="numeric"
                  value={height}
                  onChangeText={
                    setHeight
                  }
                  placeholderTextColor="#9CA3AF"
                  style={
                    styles.textInput
                  }
                />
              </View>
            </View>

            <View style={styles.measurementBox}>
              <Text
                style={styles.smallTitle}
              >
                Weight
              </Text>

              <View
                style={styles.inputCard}
              >
                <Ionicons
                  name="barbell-outline"
                  size={22}
                  color={PRIMARY}
                />

                <TextInput
                  placeholder="kg"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={
                    setWeight
                  }
                  placeholderTextColor="#9CA3AF"
                  style={
                    styles.textInput
                  }
                />
              </View>
            </View>
          </View>

                    {/* ---------- Goal ---------- */}

          <Text style={styles.sectionTitle}>
            Goal
          </Text>
          

          <View style={styles.optionGrid}>
            {[
              {
                title: "Weight Loss",
                icon: "trending-down-outline",
              },
              {
                title: "Maintain",
                icon: "remove-outline",
              },
              {
                title: "Weight Gain",
                icon: "trending-up-outline",
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.title}
                style={[
                  styles.optionCard,
                  goal === item.title &&
                    styles.selectedCard,
                ]}
                onPress={() =>
                  setGoal(item.title)
                }
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={
                    goal === item.title
                      ? "#FFF"
                      : PRIMARY
                  }
                />

                <Text
                  style={[
                    styles.optionText,
                    goal === item.title &&
                      styles.selectedText,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ---------- Health Condition ---------- */}

<Text style={styles.sectionTitle}>
  Health Condition
</Text>

<View style={styles.optionGrid}>
  {[
    "Healthy",
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Kidney Disease",
    "Pregnant",
  ].map((item) => (
    <TouchableOpacity
      key={item}
      style={[
        styles.optionCard,
        healthCondition === item &&
          styles.selectedCard,
      ]}
      onPress={() =>
        setHealthCondition(item)
      }
    >
      <Text
        style={[
          styles.optionText,
          healthCondition === item &&
            styles.selectedText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  ))}
</View>

          

          {/* ---------- Activity Level ---------- */}

          <Text style={styles.sectionTitle}>
            Activity Level
          </Text>

          <View style={styles.optionGrid}>
            {[
              "Sedentary",
              "Light",
              "Moderate",
              "Active",
            ].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.optionCard,
                  activityLevel === item &&
                    styles.selectedCard,
                ]}
                onPress={() =>
                  setActivityLevel(item)
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    activityLevel === item &&
                      styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ---------- Continue Button ---------- */}

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.9}
            onPress={validate}
          >
            <Text style={styles.buttonText}>
              Continue
            </Text>

            <Ionicons
              name="arrow-forward"
              size={22}
              color="#FFF"
            />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 30,
  },

  /* ---------- Header ---------- */

  header: {
    marginTop: 12,
    marginBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  skip: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F8A83",
  },

  /* ---------- Hero ---------- */

  hero: {
    alignItems: "center",
    marginBottom: 35,
  },

  heroCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,

    backgroundColor: "#0F8A83",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 18,

    shadowColor: "#0F8A83",
    shadowOpacity: 0.25,
    shadowRadius: 15,

    elevation: 8,
  },

  title: {
    fontSize: 31,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 12,

    fontSize: 15,

    color: "#6B7280",

    textAlign: "center",

    lineHeight: 24,

    paddingHorizontal: 8,
  },

  progressContainer: {
    width: "100%",
    marginTop: 22,
  },

  progressBackground: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },

  progressFill: {
    width: "100%",
    height: 8,
    backgroundColor: "#0F8A83",
    borderRadius: 6,
  },

  progressText: {
    marginTop: 10,

    fontSize: 13,

    color: "#6B7280",

    textAlign: "right",

    fontWeight: "600",
  },

  /* ---------- Titles ---------- */

  sectionTitle: {
    marginBottom: 12,
    marginTop: 18,

    fontSize: 18,

    fontWeight: "700",

    color: "#111827",
  },

  smallTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  /* ---------- Gender ---------- */

  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  genderCard: {
    width: "48%",

    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    paddingVertical: 24,

    justifyContent: "center",

    alignItems: "center",

    borderWidth: 1,

    borderColor: "#E5E7EB",

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  selectedCard: {
    backgroundColor: "#0F8A83",
    borderColor: "#0F8A83",
  },

  genderText: {
    marginTop: 10,

    fontSize: 17,

    fontWeight: "700",

    color: "#111827",
  },

  selectedText: {
    color: "#FFFFFF",
  },

  /* ---------- Inputs ---------- */

  inputCard: {
    height: 58,

    borderRadius: 18,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E5E7EB",

    paddingHorizontal: 16,

    flexDirection: "row",

    alignItems: "center",

    shadowColor: "#000",

    shadowOpacity: 0.04,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,

    marginBottom: 15,
  },

  textInput: {
    flex: 1,

    marginLeft: 12,

    fontSize: 16,

    color: "#111827",
  },

  /* ---------- Height Weight ---------- */

  measurementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  measurementBox: {
    width: "48%",
  },

  /* ---------- Goal ---------- */

  optionGrid: {
    marginBottom: 18,
  },

  optionCard: {
    height: 58,

    borderRadius: 18,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E5E7EB",

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 18,

    marginBottom: 12,

    shadowColor: "#000",

    shadowOpacity: 0.04,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  optionText: {
    marginLeft: 12,

    fontSize: 16,

    fontWeight: "600",

    color: "#111827",
  },

  /* ---------- Button ---------- */

  button: {
    height: 60,

    borderRadius: 30,

    backgroundColor: "#0F8A83",

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",
  
    shadowColor: "#0F8A83",

    shadowOpacity: 0.30,

    shadowRadius: 14,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 8,
  },

  buttonText: {
    color: "#FFFFFF",

    fontSize: 18,

    fontWeight: "700",

    marginRight: 8,
  },
});