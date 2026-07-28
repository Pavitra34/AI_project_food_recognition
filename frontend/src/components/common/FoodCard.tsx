import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  addFavorite,
  removeFavorite,
} from "../../services/favoriteService";
import API_BASE_URL from "../../constants/api";
import { getScanId } from "../../utils/scanItem";

type Props = {
  item: any;
 variant?: "horizontal" | "vertical";
  onPress: () => void;
  isFavorite?: boolean;
  onFavoriteChanged?: () => void;

  onDelete?: () => void;   // <-- Add this
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB");
};



export default function FoodCard({
  item,
  variant = "vertical",
  onPress,
  isFavorite = false,
  onFavoriteChanged,
  onDelete,
}: Props) {

useEffect(() => {
  setFavorite(isFavorite);
}, [isFavorite]);
  const [favorite, setFavorite] = useState(isFavorite);

  const scanId = getScanId(item);

  const handleFavorite = async () => {
    try {
      if (favorite) {
        await removeFavorite(scanId);
        setFavorite(false);
      } else {
        await addFavorite(scanId);
        setFavorite(true);
      }

      onFavoriteChanged?.();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePress = (event?: any) => {
    event?.stopPropagation?.();
    onDelete?.();
  };
  const imageUrl = `${API_BASE_URL}${item.image_path}`;

  if (variant === "horizontal") {
    return (
      <TouchableOpacity
        style={styles.horizontalCard}
        
        activeOpacity={0.9}
        onPress={onPress}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            ⭐ {(item.confidence ?? 0).toFixed(1)}%
          </Text>
        </View>

        <Image
          source={{ uri: imageUrl }}
          style={styles.horizontalImage}
          resizeMode="cover"
        />
<TouchableOpacity
  style={{
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    zIndex: 100,
  }}
  onPress={(e) => {
    e.stopPropagation?.();
    handleFavorite();
  }}
>
  <Ionicons
    name={favorite ? "heart" : "heart-outline"}
    size={26}
    color="#EF4444"
  />
</TouchableOpacity>
        <View style={styles.content}>
          <Text
            style={styles.foodName}
            numberOfLines={1}
          >
            {item.food_name.replace(/_/g, " ")}
          </Text>

          <Text style={styles.calories}>
            🔥 {item.nutrition?.calories ?? 0} kcal
          </Text>

          <Text style={styles.time}>
            🕒 {formatDate(item.created_at)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.verticalCard}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.verticalImage}
      />

<View style={styles.info}>
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Text
      style={styles.food}
      numberOfLines={1}
    >
      {item.food_name.replace(/_/g, " ")}
    </Text>
  </View>

  <Text style={styles.calories}>
    🔥 {item.nutrition?.calories ?? 0} kcal
  </Text>

<Text style={styles.time}>
  🕒 {item.created_at ? formatDate(item.created_at) : "Recently"}
</Text>
</View>

<View style={styles.rightSide}>
  <View style={styles.verticalBadge}>
    <Text style={styles.badgeText}>
      ⭐ {(item.confidence ?? 0).toFixed(1)}%
    </Text>
  </View>

  {onDelete && (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={handleDeletePress}
    >
      <Ionicons
        name="trash-outline"
        size={24}
        color="#EF4444"
      />
    </TouchableOpacity>
  )}

  <TouchableOpacity
    onPress={(e) => {
      e.stopPropagation?.();
      handleFavorite();
    }}
  >
    <Ionicons
      name={favorite ? "heart" : "heart-outline"}
      size={28}
      color="#EF4444"
    />
  </TouchableOpacity>
</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  horizontalCard: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 22,
    marginLeft: 20,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  horizontalImage: {
    width: "100%",
    height: 145,
  },

  verticalCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 14,
    marginBottom: 18,

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  verticalImage: {
    width: 95,
    height: 95,
    borderRadius: 16,
  },

  content: {
    padding: 14,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  food: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textTransform: "capitalize",
  },

  foodName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    textTransform: "capitalize",
  },

  calories: {
    marginTop: 8,
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 15,
  },

  time: {
    marginTop: 6,
    color: "#9CA3AF",
    fontSize: 13,
  },

rightSide: {
  justifyContent: "center",
  alignItems: "center",
  marginLeft: 12,
},

deleteButton: {
  marginVertical: 10,
},

  badge: {
    backgroundColor: "#0F8A83",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },

  verticalBadge: {
    backgroundColor: "#0F8A83",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
});