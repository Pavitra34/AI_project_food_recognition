import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const PRIMARY = "#0F8A83";

type Props = {
  navigation?: any;
};

type ActionItem = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string;
  isStackScreen?: boolean;
};

export default function QuickActions({ navigation }: Props) {
  const actions: ActionItem[] = [
    {
      title: "Scan Food",
      icon: "camera-outline",
      screen: "Scan",
      isStackScreen: true,
    },
    {
      title: "History",
      icon: "time-outline",
      screen: "History",
    },
    {
      title: "Favorites",
      icon: "heart-outline",
      screen: "Favourite",
    },
    {
      title: "Profile",
      icon: "person-outline",
      screen: "Profile",
    },
{
  title: "Water",
  icon: "water-outline",
  screen: "WaterReminder",
  isStackScreen: true,
},
  ];

  const handlePress = (item: ActionItem) => {
    if (!navigation) {
      return;
    }

    if (item.isStackScreen) {
      navigation.getParent()?.navigate(item.screen);
      return;
    }

    navigation.navigate(item.screen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Quick Actions</Text>

      <View style={styles.grid}>
        {actions.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handlePress(item)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={30} color={PRIMARY} />
            </View>

            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 20,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E6F8F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
});
