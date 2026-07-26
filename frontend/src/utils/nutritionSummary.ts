import type { ScanHistoryItem } from "../types/history";

export type NutritionSummary = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  totalScans: number;
};

export const calculateNutritionSummary = (
  history: ScanHistoryItem[]
): NutritionSummary => {
  return history.reduce(
    (totals, item) => ({
      calories: totals.calories + (item.nutrition?.calories ?? 0),
      protein: totals.protein + (item.nutrition?.protein ?? 0),
      carbs: totals.carbs + (item.nutrition?.carbs ?? 0),
      fat: totals.fat + (item.nutrition?.fat ?? 0),
      totalScans: totals.totalScans + 1,
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      totalScans: 0,
    }
  );
};
