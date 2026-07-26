import { apiClient } from "./apiClient";

export const getDashboard = async () => {
  try {
    const response = await apiClient.get("/dashboard");
    return response.data;
  } catch (error) {
    console.log("Dashboard Error:", error);
    throw error;
  }
};
