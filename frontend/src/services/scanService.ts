import { apiClient } from "./apiClient";
import { AxiosError } from "axios";

export const MIN_CONFIDENCE = 50;

export type ScanResult = {
  scan_id: number;
  food_name: string;
  confidence: number;
  image_path: string;

  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    cholesterol?: number;
    iron?: number;
  };

  recommendation: {
    status: string;
    reason: string;
  };
};


export const scanFood = async (
  imageUri: string
): Promise<ScanResult> => {
  const formData = new FormData();

  formData.append("file", {
    uri: imageUri,
    name: "food.jpg",
    type: "image/jpeg",
  } as any);

  try {
    const response = await apiClient.post<ScanResult>(
      "/scan",
      formData,
      {
        timeout: 90000,
      }
    );

    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;

    console.log("========== SCAN ERROR ==========");
    console.log("Status :", error.response?.status);
    console.log("Data :", error.response?.data);

    throw error;
  }
};

export const getScanErrorMessage = (
  error: any
): string => {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail) && detail[0]?.msg) {
    return detail[0].msg;
  }

  if (error?.message === "Network Error") {
    return "Unable to reach server. Check your connection.";
  }

  return "Failed to analyze image. Please try again.";
};
