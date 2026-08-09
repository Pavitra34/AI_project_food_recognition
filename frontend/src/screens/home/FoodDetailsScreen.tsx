import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import API_BASE_URL from "../../constants/api";
import AppHeader from "../../components/common/AppHeader";

export default function FoodDetailsScreen({
  route,
  navigation,
}: any) {
  const { food } = route.params;

  const imageUrl = `${API_BASE_URL}${food.image_path}`;

  const nutrition = food.nutrition ?? {};

  return (
    <View style={styles.container}>
      <AppHeader
        title="Food Details"
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              ⭐ {(food.confidence ?? 0).toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.foodName}>
            {food.food_name.replace(/_/g, " ")}
          </Text>

          <Text style={styles.section}>
            Nutrition Facts
          </Text>

          <View style={styles.grid}>
            <NutritionCard
              icon="flame"
              title="Calories"
              value={`${nutrition.calories ?? 0} kcal`}
              color="#EF4444"
            />

            <NutritionCard
              icon="barbell"
              title="Protein"
              value={`${nutrition.protein ?? 0} g`}
              color="#3B82F6"
            />

            <NutritionCard
              icon="pizza"
              title="Carbs"
              value={`${nutrition.carbs ?? 0} g`}
              color="#F59E0B"
            />

            <NutritionCard
              icon="water"
              title="Fat"
              value={`${nutrition.fat ?? 0} g`}
              color="#8B5CF6"
            />

            <NutritionCard
              icon="leaf"
              title="Fiber"
              value={`${nutrition.fiber ?? 0} g`}
              color="#22C55E"
            />

            <NutritionCard
              icon="cafe"
              title="Sugar"
              value={`${nutrition.sugar ?? 0} g`}
              color="#EC4899"
            />
          </View>

          <TouchableOpacity
            style={styles.scanAgain}
onPress={() => navigation.navigate("Scan")}
          >
            <Ionicons
              name="camera"
              size={22}
              color="#fff"
            />

            <Text style={styles.scanAgainText}>
              Scan Again
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function NutritionCard({
  title,
  value,
  icon,
  color,
}: any) {
  return (
    <View style={styles.card}>
      <Ionicons
        name={icon}
        size={24}
        color={color}
      />

      <Text style={styles.cardTitle}>
        {title}
      </Text>

      <Text style={styles.cardValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#F7F8FA",
  marginTop:20
},

imageContainer: {
  width: "100%",
  height: 320,
  overflow: "hidden",
  backgroundColor: "#EEE",
},

image: {
  width: "100%",
  height: "100%",
},

badge: {
  position: "absolute",
  top: 18,
  right: 18,

  backgroundColor: "#0F8A83",

  borderRadius: 25,

  paddingHorizontal: 14,
  paddingVertical: 8,
},

  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

content: {
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 30,
},
  foodName: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },

  scanTime: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 15,
  },

  section: {
    marginTop: 28,
    marginBottom: 18,
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  cardTitle: {
    marginTop: 10,
    color: "#6B7280",
    fontSize: 14,
  },

  cardValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  scanAgain: {
    marginTop: 20,
    marginBottom: 40,
    height: 56,
    backgroundColor: "#0F8A83",
    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  scanAgainText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 10,
  },
backButton:{
position:"absolute",
left:20,

width:44,
height:44,

backgroundColor:"rgba(255,255,255,0.95)",

borderRadius:22,

justifyContent:"center",
alignItems:"center",
},

title:{
fontSize:22,
fontWeight:"700",
color:"#fff"
},

});