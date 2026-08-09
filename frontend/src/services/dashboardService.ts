import { apiClient } from "./apiClient";

export type DashboardData = {
  total_scans: number;
  today_calories: number;
  today_protein: number;
  today_carbs: number;
  today_fat: number;
  recent_foods: string[];
};

export const getDashboard = async (): Promise<DashboardData> => {
  const response = await apiClient.get<DashboardData>(
    "/dashboard"
  );

  return response.data;
};