import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "../../components/common/AppHeader";
import {
  sendWaterProgressNotification,
} from "../../services/notificationService";

export default function WaterReminderScreen() {
const STORAGE_KEY = "water_intake";
const DATE_KEY = "water_date";

const [goal] = useState(2500);
const [currentWater, setCurrentWater] = useState(0);

const percentage = Math.min((currentWater / goal) * 100, 100);
const progress = currentWater / goal;
const remaining = Math.max(goal - currentWater, 0);

let reminderTitle = "";
let reminderMessage = "";
let hydrationTip = "";

if (progress >= 1) {
  reminderTitle = "Goal Completed 🎉";
  reminderMessage = "Excellent! You've reached today's water goal.";
  hydrationTip =
    "Great job! Keep maintaining this healthy habit every day.";
} else if (progress >= 0.8) {
  reminderTitle = "Almost There 💧";
  reminderMessage = `Only ${remaining} ml left to reach today's goal.`;
  hydrationTip =
    "You're almost there. One more glass of water will complete your goal.";
} else if (progress >= 0.5) {
  reminderTitle = "Keep Going ";
  reminderMessage =
    "You're doing well. Drink another glass within the next hour.";
  hydrationTip =
    "Drinking water improves digestion, concentration and energy levels.";
} else {
  reminderTitle = "Time to Drink ";
  reminderMessage =
    "Take a short break and drink a glass of water now.";
  hydrationTip =
    "Start your day with a glass of water to boost your metabolism.";
}

const addWater = async (amount: number) => {
  const total = Math.min(currentWater + amount, goal);

  setCurrentWater(total);

  await AsyncStorage.setItem(STORAGE_KEY, total.toString());

const remaining = Math.max(goal - total, 0);

await sendWaterProgressNotification(
    amount,
    remaining
);
};

const resetWater = async () => {
  setCurrentWater(0);

  await AsyncStorage.setItem(STORAGE_KEY, "0");
};

useEffect(() => {
  loadWaterData();
}, []);

const loadWaterData = async () => {
  try {
    const today = new Date().toDateString();

    const savedDate = await AsyncStorage.getItem(DATE_KEY);

    if (savedDate !== today) {
      await AsyncStorage.setItem(DATE_KEY, today);
      await AsyncStorage.setItem(STORAGE_KEY, "0");
      setCurrentWater(0);
      return;
    }

    const savedWater = await AsyncStorage.getItem(STORAGE_KEY);

    if (savedWater) {
      setCurrentWater(Number(savedWater));
    }
  } catch (e) {
    console.log(e);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}

       
        <AppHeader title="Water Reminder" showBack />
        
        {/* Goal Card */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Daily Goal
          </Text>

          <Text style={styles.goalText}>
            {(goal / 1000).toFixed(1)} L
          </Text>

          <Text style={styles.current}>
            {currentWater} ml / {goal} ml
          </Text>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${percentage}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.percent}>
            {percentage.toFixed(0)}% Completed
          </Text>
        </View>

        {/* Quick Add */}

        <Text style={styles.sectionTitle}>
          Quick Add
        </Text>

        <View style={styles.buttonGrid}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => addWater(250)}
          >
            <Text style={styles.buttonText}>
              +250 ml
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => addWater(500)}
          >
            <Text style={styles.buttonText}>
              +500 ml
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => addWater(750)}
          >
            <Text style={styles.buttonText}>
              +750 ml
            </Text>
          </TouchableOpacity>

<TouchableOpacity
  style={[styles.button, styles.resetButton]}
  onPress={resetWater}
>
  <Text style={styles.buttonText}>
    Reset
  </Text>
</TouchableOpacity>
        </View>

        {/* Reminder */}

        <Text style={styles.sectionTitle}>
          Reminder
        </Text>

<View style={styles.reminderCard}>
  <Ionicons
    name="notifications"
    size={28}
    color="#0F8A83"
  />

  <View style={styles.reminderContent}>
    <Text style={styles.reminderTitle}>
      {reminderTitle}
    </Text>

    <Text style={styles.reminderSub}>
      {reminderMessage}
    </Text>
  </View>
</View>
        <Text style={styles.remaining}>
  {remaining} ml Remaining
</Text>

        {/* Tips */}

        <Text style={styles.sectionTitle}>
          Hydration Tip
        </Text>

        <View style={styles.tipCard}>
          <Ionicons
            name="leaf"
            size={28}
            color="#22C55E"
          />
<Text style={styles.tipText}>
  {hydrationTip}
</Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#F7F8FA",
  paddingTop:25
  
},

remaining: {
  marginTop: 10,
  textAlign: "left",
  color: "#0e870e",
  fontSize: 15,
  fontWeight: "600",
  paddingHorizontal:25,
  marginBottom:8
},


  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#6B7280",
  },

  iconBox: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: "#DFF7F4",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    elevation: 5,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
  },

  goalText: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: "700",
    color: "#0F8A83",
  },

  current: {
    marginTop: 10,
    fontSize: 16,
    color: "#374151",
  },

  progressBackground: {
    marginTop: 20,
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#0F8A83",
    borderRadius: 10,
  },

  percent: {
    marginTop: 10,
    textAlign: "right",
    color: "#6B7280",
    fontWeight: "600",
  },

  sectionTitle: {
    marginHorizontal: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom:8
  },

  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  button: {
    width: "48%",
    backgroundColor: "#0F8A83",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 15,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  resetButton: {
    width: "48%",
    backgroundColor: "#EF4444",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  resetText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  reminderCard: {
  marginHorizontal: 20,
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  padding: 18,
  flexDirection: "row",
  alignItems: "flex-start",
  elevation: 3,
},

reminderContent: {
  flex: 1,
  marginLeft: 15,

},

reminderTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#111827",
  
},

reminderSub: {
  fontSize: 15,
  color: "#6B7280",
  lineHeight: 22,
},


  tipCard: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    elevation: 3,
    marginBottom: 40,
  },

  tipText: {
    marginLeft: 15,
    flex: 1,
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
});