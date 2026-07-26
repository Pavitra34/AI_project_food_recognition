import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type Props = {
  title: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
};

export default function AppHeader({
  title,
  showBack = false,
  rightComponent,
}: Props) {
  const navigation = useNavigation<any>();

  return (
<View style={styles.container}>
  <View style={styles.left}>
    {showBack ? (
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color="#111827"
        />
      </TouchableOpacity>
    ) : (
      <View style={styles.placeholder} />
    )}
  </View>

  <Text style={styles.title}>{title}</Text>

  <View style={styles.right}>
    {rightComponent ?? <View style={styles.placeholder} />}
  </View>
</View>
  );
}

const styles = StyleSheet.create({
container: {
  height: 80,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  backgroundColor: "#F7F8FA",
},
left: {
  width: 45,
  alignItems: "flex-start",
},
right: {
  width: 45,
  alignItems: "flex-end",
},

  placeholder: {
    width: 45,
    height: 45,
  },

backButton: {
  width: 44,
  height: 44,

  borderRadius: 14,
  backgroundColor: "#FFFFFF",

  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 3,
  },
  elevation: 4,
},

title: {
  flex: 1,
  textAlign: "center",
  fontSize: 22,
  fontWeight: "700",
  color: "#111827",
},
});