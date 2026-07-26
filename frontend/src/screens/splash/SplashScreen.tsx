import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import * as Progress from "react-native-progress";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../constants/colors";

type Props = {
  navigation: any;
};

export default function SplashScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;

    const timer = setInterval(() => {
      value += 1;

      setProgress(value);

      if (value >= 100) {
        clearInterval(timer);

        setTimeout(() => {
          navigation.replace("Auth");
        }, 2500); // 2.5 Seconds
      }
    }, 25);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={{ height: insets.top, backgroundColor: Colors.white }} />

      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>NutriScan</Text>

        <Text style={styles.subtitle}>AI Food Recognition</Text>

        <Progress.Bar
          progress={progress / 100}
          width={250}
          height={10}
          borderRadius={20}
          color="#FFFFFF"
          unfilledColor="rgba(255,255,255,0.25)"
          borderWidth={0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  container: {
    flex: 1,
    backgroundColor: "#0F8A83",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 35,
  },

  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#D8F3F0",
    marginBottom: 70,
  },
});