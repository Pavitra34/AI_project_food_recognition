export type UserProfile = {
  full_name: string;
  email: string;
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
  goal?: string | null;
  activity_level?: string | null;
   health_condition: string | null;
  bmi?: number | null;
  bmi_category?: string | null;
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
};
