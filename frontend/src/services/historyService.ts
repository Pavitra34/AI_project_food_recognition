import { apiClient } from "./apiClient";
import type { ScanHistoryItem } from "../types/history";

type FetchHistoryOptions = {
  force?: boolean;
};

let cachedHistory: ScanHistoryItem[] | null = null;
let inFlightRequest: Promise<ScanHistoryItem[]> | null = null;

const normalizeHistory = (data: unknown): ScanHistoryItem[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data as ScanHistoryItem[];
};

export const fetchHistory = async (
  options: FetchHistoryOptions = {}
): Promise<ScanHistoryItem[]> => {
  if (!options.force && cachedHistory) {
    return cachedHistory;
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = apiClient
    .get<ScanHistoryItem[]>("/history")
    .then((response) => {
      cachedHistory = normalizeHistory(response.data);
      return cachedHistory;
    })
    .catch((error) => {
      console.log("History fetch error:", error);
      throw error;
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
};

export const invalidateHistoryCache = () => {
  cachedHistory = null;
};

export const getCachedHistory = (): ScanHistoryItem[] | null => cachedHistory;
