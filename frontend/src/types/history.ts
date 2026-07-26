export type NutritionInfo = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

export type ScanHistoryItem = {
  scan_id: number;
  food_name: string;
  image_path: string;
  confidence?: number;
  created_at?: string;
  nutrition?: NutritionInfo;
};
