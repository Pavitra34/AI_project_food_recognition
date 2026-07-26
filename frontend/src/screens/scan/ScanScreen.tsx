import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import AppHeader from "../../components/common/AppHeader";
import {
  getScanErrorMessage,
  MIN_CONFIDENCE,
  scanFood,
  type ScanResult,
} from "../../services/scanService";
import { invalidateHistoryCache } from "../../services/historyService";
import { showError, showSuccess } from "../../utils/toast";

const PRIMARY = "#0F8A83";

export default function ScanScreen() {
  const navigation = useNavigation<any>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const resetScan = () => {
    setImageUri(null);
    setScanResult(null);
    setShowResult(false);
  };

  const handleScan = async (uri?: string) => {
    const selectedImage = uri ?? imageUri;

    if (!selectedImage) {
      return;
    }

    try {
      setLoading(true);

      const result = await scanFood(selectedImage);

      invalidateHistoryCache();
      setScanResult(result);
      setShowResult(true);
      showSuccess("Food scanned successfully!");
    } catch (error: any) {
      showError(getScanErrorMessage(error));
      resetScan();
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showError("Gallery permission is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await handleScan(uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      showError("Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await handleScan(uri);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader title="Scan Food" showBack />

      <Text style={styles.subtitle}>
        Take a photo or choose from gallery to analyze nutrition
      </Text>

      <View style={styles.previewContainer}>
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.image} />
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Analyzing food...</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.placeholderContent}>
            <View style={styles.placeholderIcon}>
              <Ionicons name="camera-outline" size={42} color={PRIMARY} />
            </View>

            <Text style={styles.placeholderText}>No Image Selected</Text>
            <Text style={styles.helperText}>
              Use camera or gallery to scan your meal
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color={PRIMARY} />
        <Text style={styles.infoText}>
          Only foods detected above {MIN_CONFIDENCE}% confidence will be scanned.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={takePhoto}
        disabled={loading}
      >
        <Ionicons name="camera-outline" size={22} color="#FFFFFF" />
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={pickImage}
        disabled={loading}
      >
        <Ionicons name="images-outline" size={22} color="#FFFFFF" />
        <Text style={styles.buttonText}>Choose From Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.analyzeButton,
          (!imageUri || loading) && styles.disabledButton,
        ]}
        disabled={!imageUri || loading}
        onPress={() => handleScan()}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="scan-outline" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Analyze Food</Text>
          </>
        )}
      </TouchableOpacity>

      <Modal visible={showResult} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Analysis Result</Text>

            {scanResult && (
              <>
                <Text style={styles.foodName}>
                  {scanResult.food_name.replace(/_/g, " ")}
                </Text>

                <Text style={styles.confidence}>
                  Confidence: {scanResult.confidence.toFixed(1)}%
                </Text>

                <View style={styles.nutritionGrid}>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.label}>Calories</Text>
                    <Text style={styles.value}>
                      {scanResult.nutrition.calories} kcal
                    </Text>
                  </View>

                  <View style={styles.nutritionItem}>
                    <Text style={styles.label}>Protein</Text>
                    <Text style={styles.value}>
                      {scanResult.nutrition.protein} g
                    </Text>
                  </View>

                  <View style={styles.nutritionItem}>
                    <Text style={styles.label}>Carbs</Text>
                    <Text style={styles.value}>
                      {scanResult.nutrition.carbs} g
                    </Text>
                  </View>

                  <View style={styles.nutritionItem}>
                    <Text style={styles.label}>Fat</Text>
                    <Text style={styles.value}>
                      {scanResult.nutrition.fat} g
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => {
                    setShowResult(false);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.scanAgainButton}
                  onPress={resetScan}
                >
                  <Text style={styles.scanAgainText}>Scan Another</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
    paddingHorizontal: 20,
  },

  subtitle: {
    marginTop: 2,
    marginBottom: 20,
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },

  previewContainer: {
    height: 300,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 138, 131, 0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  placeholderContent: {
    alignItems: "center",
    paddingHorizontal: 24,
  },

  placeholderIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#E6F8F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  placeholderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  helperText: {
    marginTop: 8,
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F8F6",
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    marginBottom: 8,
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    color: "#0F766E",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },

  primaryButton: {
    marginTop: 16,
    height: 56,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  secondaryButton: {
    marginTop: 12,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#148A84",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  analyzeButton: {
    marginTop: 12,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  disabledButton: {
    backgroundColor: "#9CA3AF",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#111827",
  },

  foodName: {
    fontSize: 24,
    fontWeight: "700",
    textTransform: "capitalize",
    textAlign: "center",
    color: "#111827",
  },

  confidence: {
    textAlign: "center",
    color: PRIMARY,
    marginTop: 8,
    marginBottom: 20,
    fontWeight: "600",
  },

  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  nutritionItem: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  label: {
    color: "#6B7280",
    fontSize: 14,
  },

  value: {
    marginTop: 5,
    fontWeight: "700",
    fontSize: 18,
    color: "#111827",
  },

  doneButton: {
    marginTop: 20,
    backgroundColor: PRIMARY,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  doneText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  scanAgainButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: PRIMARY,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  scanAgainText: {
    color: PRIMARY,
    fontWeight: "700",
  },
});
