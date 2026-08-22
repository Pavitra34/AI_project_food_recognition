import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import API_BASE_URL from "../../constants/api";


type Props = {
  navigation: any;
  route: any;
};

export default function PrecautionsScreen({
  navigation,
  route,
}: Props) {
  const healthCondition =
    route?.params?.healthCondition || "Healthy";

  const [precautions, setPrecautions] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

const loadData = useCallback(async () => {
  try {
    setLoading(true);

    console.log("================================");
    console.log("Health Condition:", healthCondition);
    console.log("API Base URL:", API_BASE_URL);

    const precautionURL =
      `${API_BASE_URL}/api/precautions/condition/${encodeURIComponent(
        healthCondition
      )}`;

    const videoURL =
      `${API_BASE_URL}/api/videos/condition/${encodeURIComponent(
        healthCondition
      )}`;

    console.log("Precaution URL:", precautionURL);
    console.log("Video URL:", videoURL);

    const [precautionResponse, videoResponse] =
      await Promise.all([
        fetch(precautionURL),
        fetch(videoURL),
      ]);

    console.log(
      "Precaution Status:",
      precautionResponse.status
    );

    console.log(
      "Video Status:",
      videoResponse.status
    );

    const precautionData =
      await precautionResponse.json();

    const videoData =
      await videoResponse.json();

    console.log(
      "Precaution Data:",
      precautionData
    );

    console.log(
      "Video Data:",
      videoData
    );

    setPrecautions(
      Array.isArray(precautionData)
        ? precautionData
        : []
    );

    setVideos(
      Array.isArray(videoData)
        ? videoData
        : []
    );

  } catch (error) {
    console.log(
      "================================"
    );
    console.log(
      "Health guidance error:",
      error
    );
  } finally {
    setLoading(false);
  }
}, [healthCondition]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#0F8A83"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={25}
              color="#0F172A"
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Your Health Guidance
            </Text>

            <Text style={styles.condition}>
              Personalized for {healthCondition}
            </Text>
          </View>
        </View>

        {/* Precautions */}

        <Text style={styles.sectionTitle}>
          Recommended Precautions
        </Text>

        {precautions.map((item) => (
          <View
            key={item.id}
            style={styles.precautionCard}
          >
            <Image
  source={{
    uri: `${API_BASE_URL}${item.image_url}`,
  }}
  style={styles.precautionImage}
  resizeMode="cover"
  onLoad={() => {
    console.log("IMAGE LOADED:", item.image_url);
  }}
  onError={(error) => {
    console.log(
      "IMAGE LOAD ERROR:",
      item.image_url,
      error.nativeEvent
    );
  }}
/>

            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>
                {item.title}
              </Text>

              <Text style={styles.description}>
                {item.description}
              </Text>
            </View>
          </View>
        ))}

        {/* Videos */}

        <Text style={styles.sectionTitle}>
          Recommended Videos
        </Text>

        {videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            activeOpacity={0.85}
            style={styles.videoCard}
            onPress={() =>
              Linking.openURL(video.youtube_url)
            }
          >
            <Image
              source={{
                uri: video.thumbnail_url,
              }}
              style={styles.videoThumbnail}
            />

            <View style={styles.videoBody}>
              <Text
                style={styles.videoTitle}
                numberOfLines={2}
              >
                {video.title}
              </Text>

              <Text
                style={styles.videoDescription}
                numberOfLines={2}
              >
                {video.description}
              </Text>

              <View style={styles.watchRow}>
                <Ionicons
                  name="logo-youtube"
                  size={18}
                  color="#EF4444"
                />

                <Text style={styles.watchText}>
                  Watch Video
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  headerText: {
    marginLeft: 14,
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  condition: {
    marginTop: 4,
    fontSize: 14,
    color: "#010812",
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0D9688",
    marginBottom: 12,
    marginTop: 8,
  },

  precautionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  precautionImage: {
    width: "100%",
    height: 180,
  },

  imagePlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: "#E6FFFB",
    justifyContent: "center",
    alignItems: "center",
  },

  cardBody: {
    padding: 15,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 7,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
  },

  videoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  videoThumbnail: {
    width: "100%",
    height: 190,
  },

  videoBody: {
    padding: 14,
  },

  videoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  videoDescription: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 6,
    lineHeight: 19,
  },

  watchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  watchText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#0F8A83",
  },
});