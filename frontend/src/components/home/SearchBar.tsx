import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const PRIMARY = "#0F8A83";

type Props = {
  navigation: any;
};

export default function SearchBar({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={22}
        color="#9CA3AF"
      />

      <TextInput
        placeholder="Search foods..."
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate("Scan")}
      >
        <Ionicons
          name="camera-outline"
          size={22}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 58,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
  },

  scanButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
});