import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import AppHeader from "../../components/common/AppHeader";
import { getProfile, updateProfile } from "../../services/profileService";
import { showError, showSuccess } from "../../utils/toast";

const PRIMARY = "#0F8A83";

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [healthCondition, setHealthCondition] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setAge(profile.age?.toString() ?? "");
        setGender(profile.gender ?? "");
        setHeight(profile.height?.toString() ?? "");
        setWeight(profile.weight?.toString() ?? "");
        setGoal(profile.goal ?? "");
        setActivityLevel(profile.activity_level ?? "");
        setHealthCondition(profile.health_condition ?? "");
      } catch (error) {
        console.log(error);
        showError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (
  !age ||
  !gender ||
  !height ||
  !weight ||
  !goal ||
  !activityLevel ||
  !healthCondition
) {
  showError("Please fill all fields");
  return;
}

    try {
      setSaving(true);

await updateProfile({
  age: Number(age),
  gender,
  height: Number(height),
  weight: Number(weight),
  goal,
  activity_level: activityLevel,
  health_condition: healthCondition,
});
     

      showSuccess("Profile updated successfully");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      showError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer} edges={["top"]}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader title="Edit Profile" showBack />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>
            Update your personal and health information
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Basic Details</Text>

            <Text style={styles.sectionTitle}>Gender</Text>
            <View style={styles.row}>
              {["Male", "Female"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.choiceCard,
                    gender === item && styles.choiceCardActive,
                  ]}
                  onPress={() => setGender(item)}
                >
                  <Ionicons
                    name={item === "Male" ? "male" : "female"}
                    size={22}
                    color={gender === item ? "#FFFFFF" : PRIMARY}
                  />
                  <Text
                    style={[
                      styles.choiceText,
                      gender === item && styles.choiceTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Age</Text>
            <View style={styles.inputCard}>
              <Ionicons name="calendar-outline" size={20} color={PRIMARY} />
              <TextInput
                placeholder="Enter age"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                style={styles.input}
              />
            </View>

            <View style={styles.measureRow}>
              <View style={styles.measureBox}>
                <Text style={styles.sectionTitle}>Height (cm)</Text>
                <View style={styles.inputCard}>
                  <Ionicons name="resize-outline" size={20} color={PRIMARY} />
                  <TextInput
                    placeholder="175"
                    keyboardType="numeric"
                    value={height}
                    onChangeText={setHeight}
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.measureBox}>
                <Text style={styles.sectionTitle}>Weight (kg)</Text>
                <View style={styles.inputCard}>
                  <Ionicons name="barbell-outline" size={20} color={PRIMARY} />
                  <TextInput
                    placeholder="72"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                    style={styles.input}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Health Preferences</Text>

            <Text style={styles.sectionTitle}>Health Goal</Text>
            {["Weight Loss", "Maintain", "Weight Gain", "Muscle Gain"].map(
              (item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionCard,
                    goal === item && styles.choiceCardActive,
                  ]}
                  onPress={() => setGoal(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      goal === item && styles.choiceTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            )}

            <Text style={styles.sectionTitle}>Activity Level</Text>
            {["Sedentary", "Light", "Moderate", "Active"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.optionCard,
                  activityLevel === item && styles.choiceCardActive,
                ]}
                onPress={() => setActivityLevel(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    activityLevel === item && styles.choiceTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Health Condition</Text>

<View style={styles.optionContainer}>
  {[
    "Healthy",
    "Diabetes",
    "Heart Disease",
    "Kidney Disease",
    "Pregnant",
  ].map((item) => (
    <TouchableOpacity
      key={item}
      style={[
        styles.optionCard,
        healthCondition === item && styles.choiceCardActive,
      ]}
      onPress={() => setHealthCondition(item)}
    >
      <Text
        style={[
          styles.optionText,
          healthCondition === item && styles.choiceTextActive,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  ))}
</View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={22} color="#FFF" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F8FB",
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  subtitle: {
    marginTop: 2,
    marginBottom: 20,
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  choiceCard: {
    width: "48%",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  choiceCardActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  choiceText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  choiceTextActive: {
    color: "#FFFFFF",
  },

  inputCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111827",
  },

  measureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  measureBox: {
    width: "48%",
  },

  optionContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: 10,
},

  optionCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  optionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  saveButton: {
    marginTop: 6,
    height: 56,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
