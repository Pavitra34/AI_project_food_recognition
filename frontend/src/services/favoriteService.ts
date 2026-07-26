import { apiClient } from "./apiClient";
import type { ScanHistoryItem } from "../types/history";
import { normalizeScanItem } from "../utils/scanItem";

export const addFavorite = async (foodScanId: number) => {
  const response = await apiClient.post(`/favorites/${foodScanId}`);
  return response.data;
};

export const removeFavorite = async (foodScanId: number) => {
  const response = await apiClient.delete(`/favorites/${foodScanId}`);
  return response.data;
};

export const getFavorites = async (): Promise<ScanHistoryItem[]> => {
  const response = await apiClient.get("/favorites");
  const data = Array.isArray(response.data) ? response.data : [];

  return data.map((item) => normalizeScanItem(item));
};

export const getFavoriteIds = async (): Promise<number[]> => {
  const favorites = await getFavorites();
  return favorites.map((item) => item.scan_id);
};
