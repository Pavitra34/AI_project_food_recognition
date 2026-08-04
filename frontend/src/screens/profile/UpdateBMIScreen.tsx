import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppHeader from "../../components/common/AppHeader";
import BMIScale from "../../components/profile/BMIScale";
import { getProfile, updateProfile } from "../../services/profileService";
import type { UserProfile } from "../../types/profile";
import {
  calculateBMI,
  getBMIBadgeStyle,
  getBMICategory,
} from "../../utils/bmi";
import { showError, showSuccess } from "../../utils/toast";

const PRIMARY = "#0F8A83";

export default function UpdateBMIScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setHeight(data.height?.toString() ?? "");
        setWeight(data.weight?.toString() ?? "");
      } catch (error) {
        console.log(error);
        showError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const previewBmi = useMemo(
    () => calculateBMI(Number(weight), Number(height)),
    [height, weight]
  );

  const previewCategory = useMemo(
    () => getBMICategory(previewBmi),
    [previewBmi]
  );

  const badgeStyle = getBMIBadgeStyle(previewCategory);

  const handleSave = async () => {
    if (!height || !weight || !profile?.age || !profile.gender || !profile.goal || !profile.activity_level) {
      showError("Please enter valid height and weight");
      return;
    }

    try {
      setSaving(true);

await updateProfile({
  age: profile.age,
  gender: profile.gender,
  height: Number(height),
  weight: Number(weight),
  goal: profile.goal,
  activity_level: profile.activity_level,
  health_condition: profile.health_condition ?? "Healthy",
});

      showSuccess("BMI updated successfully");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      showError("Failed to update BMI");
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
      <AppHeader title="Update BMI" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>
          Update your height and weight to recalculate BMI
        </Text>

        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>Current BMI Preview</Text>

          <View style={styles.previewRow}>
            <Text style={styles.previewValue}>
              {previewBmi?.toFixed(1) ?? "--"}{" "}
              <Text style={styles.previewUnit}>BMI</Text>
            </Text>

            <View
              style={[
                styles.previewBadge,
                { backgroundColor: badgeStyle.backgroundColor },
              ]}
            >
              <Text
                style={[
                  styles.previewBadgeText,
                  { color: badgeStyle.color },
                ]}
              >
                {previewCategory}
              </Text>
            </View>
          </View>

          <BMIScale bmi={previewBmi} />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Height & Weight</Text>

          <View style={styles.measureRow}>
            <View style={styles.measureBox}>
              <Text style={styles.fieldLabel}>Height (cm)</Text>
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
              <Text style={styles.fieldLabel}>Weight (kg)</Text>
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

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save-outline" size={22} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save BMI</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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

  previewCard: {
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

  previewLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },

  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 4,
  },

  previewValue: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111827",
  },

  previewUnit: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
  },

  previewBadge: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  previewBadgeText: {
    fontWeight: "700",
    fontSize: 13,
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },

  measureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  measureBox: {
    width: "48%",
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
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
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111827",
  },

  saveButton: {
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
