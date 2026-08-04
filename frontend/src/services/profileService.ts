import { apiClient } from "./apiClient";
import type {
  ProfileUpdatePayload,
  UserProfile,
} from "../types/profile";

import {
  getCachedUserProfile,
  getStoredAuthUser,
  saveUserProfile,
} from "../utils/profileStorage";

const normalizeProfile = (
  data: UserProfile,
  cached?: UserProfile | null
): UserProfile => ({
  full_name: data.full_name ?? cached?.full_name ?? "",
  email: data.email ?? cached?.email ?? "",

  age: data.age ?? cached?.age ?? null,
  gender: data.gender ?? cached?.gender ?? null,
  height: data.height ?? cached?.height ?? null,
  weight: data.weight ?? cached?.weight ?? null,

  goal: data.goal ?? cached?.goal ?? null,
  activity_level:
    data.activity_level ?? cached?.activity_level ?? null,

  health_condition:
    data.health_condition ?? cached?.health_condition ?? null,

  bmi: data.bmi ?? cached?.bmi ?? null,
  bmi_category:
    data.bmi_category ?? cached?.bmi_category ?? null,

  // Daily Nutrition Goals
  daily_calories:
    data.daily_calories ?? cached?.daily_calories ?? 0,

  daily_protein:
    data.daily_protein ?? cached?.daily_protein ?? 0,

  daily_carbs:
    data.daily_carbs ?? cached?.daily_carbs ?? 0,

  daily_fat:
    data.daily_fat ?? cached?.daily_fat ?? 0,

  daily_water:
    data.daily_water ?? cached?.daily_water ?? 0,

  member_since:
    data.member_since ?? cached?.member_since ?? null,

  avatar_uri:
    data.avatar_uri ?? cached?.avatar_uri ?? null,
});

export const getProfile = async (): Promise<UserProfile> => {
  const authUser = await getStoredAuthUser();

  if (!authUser?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await apiClient.get<UserProfile>("/profile");

    const cached = await getCachedUserProfile(authUser.id);

    const profile = normalizeProfile(
      response.data,
      cached
    );

    await saveUserProfile(authUser.id, profile);

    return profile;
  } catch (error) {
    const cached = await getCachedUserProfile(authUser.id);

    if (cached) {
      return cached;
    }

    throw error;
  }
};

export const updateProfile = async (
  profileData: ProfileUpdatePayload
): Promise<UserProfile> => {
  const authUser = await getStoredAuthUser();

  if (!authUser?.id) {
    throw new Error("User not authenticated");
  }

  const response = await apiClient.put<UserProfile>(
    "/profile",
    profileData
  );

  const cached = await getCachedUserProfile(authUser.id);

  const profile = normalizeProfile(
    response.data,
    cached
  );

  await saveUserProfile(authUser.id, profile);

  return profile;
};

export const getCachedProfile = async (): Promise<UserProfile | null> => {
  const authUser = await getStoredAuthUser();

  if (!authUser?.id) {
    return null;
  }

  return getCachedUserProfile(authUser.id);
};