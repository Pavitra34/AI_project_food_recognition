import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  fetchHistory,
  getCachedHistory,
} from "../services/historyService";
import type { ScanHistoryItem } from "../types/history";

type UseHistoryOptions = {
  refetchOnFocus?: boolean;
  limit?: number;
};

type UseHistoryResult = {
  history: ScanHistoryItem[];
  loading: boolean;
  error: string | null;
  refresh: (force?: boolean) => Promise<void>;
};

export function useHistory(
  options: UseHistoryOptions = {}
): UseHistoryResult {
  const { refetchOnFocus = false, limit } = options;

  const [history, setHistory] = useState<ScanHistoryItem[]>(
    () => getCachedHistory() ?? []
  );
  const [loading, setLoading] = useState(!getCachedHistory());
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchHistory({ force });
      setHistory(limit ? data.slice(0, limit) : data);
    } catch {
      setError("Failed to load scan history");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useFocusEffect(
    useCallback(() => {
      refresh(refetchOnFocus);
    }, [refresh, refetchOnFocus])
  );

  return {
    history,
    loading,
    error,
    refresh,
  };
}
