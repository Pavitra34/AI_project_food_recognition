import type { ScanHistoryItem } from "../types/history";

type ScanLike = {
  scan_id?: number;
  id?: number;
};

export const getScanId = (item: ScanLike): number => {
  const scanId = item.scan_id ?? item.id;

  if (scanId == null) {
    throw new Error("Scan item is missing scan_id");
  }

  return scanId;
};

export const getScanKey = (item: ScanLike, index: number): string => {
  try {
    return getScanId(item).toString();
  } catch {
    return `scan-${index}`;
  }
};

export const normalizeScanItem = (
  item: ScanHistoryItem & { id?: number }
): ScanHistoryItem => ({
  ...item,
  scan_id: getScanId(item),
});
