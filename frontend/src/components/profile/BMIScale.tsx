import React from "react";
import { View, Text, StyleSheet } from "react-native";

import {
  getBMIPosition,
  getBMISegmentWidths,
} from "../../utils/bmi";

type Props = {
  bmi?: number | null;
};

const PRIMARY = "#0F8A83";

export default function BMIScale({ bmi }: Props) {
  const segments = getBMISegmentWidths();
  const pointerLeft = `${getBMIPosition(bmi)}%`;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.segment, styles.under, { width: `${segments.under}%` }]} />
        <View style={[styles.segment, styles.normal, { width: `${segments.normal}%` }]} />
        <View style={[styles.segment, styles.over, { width: `${segments.over}%` }]} />

        {!!bmi && (
          <View
            style={[styles.pointer, { left: pointerLeft as `${number}%` }]}
          />
        )}
      </View>

      <View style={styles.labels}>
        <Text style={[styles.labelText, { width: `${segments.under}%` }]}>
          Under
        </Text>
        <Text style={[styles.labelText, styles.labelCenter, { width: `${segments.normal}%` }]}>
          Normal
        </Text>
        <Text style={[styles.labelText, styles.labelRight, { width: `${segments.over}%` }]}>
          Over
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },

  track: {
    height: 12,
    borderRadius: 999,
    flexDirection: "row",
    position: "relative",
    overflow: "visible",
  },

  segment: {
    height: "100%",
  },

  under: {
    backgroundColor: "#FACC15",
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
  },

  normal: {
    backgroundColor: PRIMARY,
  },

  over: {
    backgroundColor: "#EF4444",
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },

  pointer: {
    position: "absolute",
    top: -5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: PRIMARY,
    marginLeft: -11,
  },

  labels: {
    flexDirection: "row",
    marginTop: 10,
  },

  labelText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },

  labelCenter: {
    textAlign: "center",
  },

  labelRight: {
    textAlign: "right",
  },
});
