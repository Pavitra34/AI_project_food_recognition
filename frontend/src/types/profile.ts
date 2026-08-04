export type UserProfile = {
  full_name: string;
  email: string;

  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;

  goal?: string | null;
  activity_level?: string | null;
  health_condition?: string | null;

  bmi?: number | null;
  bmi_category?: string | null;

  // Daily Nutrition Goals
  daily_calories?: number | null;
  daily_protein?: number | null;
  daily_carbs?: number | null;
  daily_fat?: number | null;
  daily_water?: number | null;

  member_since?: string | null;
  avatar_uri?: string | null;
};

export type ProfileUpdatePayload = {
  age: number;
  gender: string;
  height: number;
  weight: number;

  goal: string;
  activity_level: string;
  health_condition: string;
};

