import AsyncStorage from "@react-native-async-storage/async-storage";

import type { UserProfile } from "../types/profile";

const PROFILE_PREFIX = "profile_cache_";
const MEMBER_SINCE_PREFIX = "member_since_";

const getProfileKey = (userId: number | string) =>
  `${PROFILE_PREFIX}${userId}`;

const getMemberSinceKey = (userId: number | string) =>
  `${MEMBER_SINCE_PREFIX}${userId}`;

export const formatMemberSince = (date = new Date()) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

export const saveUserProfile = async (
  userId: number | string,
  profile: UserProfile
) => {
  const memberSinceKey = getMemberSinceKey(userId);
  const existingMemberSince = await AsyncStorage.getItem(memberSinceKey);

  if (!existingMemberSince) {
    await AsyncStorage.setItem(
      memberSinceKey,
      formatMemberSince()
    );
  }

  const memberSince =
    profile.member_since ??
    existingMemberSince ??
    formatMemberSince();

  await AsyncStorage.setItem(
    getProfileKey(userId),
    JSON.stringify({
      ...profile,
      member_since: memberSince,
    })
  );
};

export const getCachedUserProfile = async (
  userId: number | string
): Promise<UserProfile | null> => {
  try {
    const stored = await AsyncStorage.getItem(getProfileKey(userId));

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as UserProfile;
  } catch {
    return null;
  }
};

export const getStoredAuthUser = async () => {
  try {
    const stored = await AsyncStorage.getItem("user");

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as {
      id: number;
      full_name: string;
      email: string;
      phone?: string;
    };
  } catch {
    return null;
  }
};

export const saveProfileAvatar = async (
  userId: number | string,
  avatarUri: string
) => {
  const cached = await getCachedUserProfile(userId);
  const profile: UserProfile = cached ?? {
    full_name: "",
    email: "",
  };

  await saveUserProfile(userId, {
    ...profile,
    avatar_uri: avatarUri,
  });
};

export const clearAuthSession = async () => {
  const authUser = await getStoredAuthUser();

  console.log("========== LOGOUT ==========");

  if (authUser?.id) {
    console.log("User ID:", authUser.id);
  }

  await AsyncStorage.removeItem("token");
  console.log("✓ Token removed");

  await AsyncStorage.removeItem("auth_user");
  console.log("✓ Auth user removed");

  console.log("========== LOGOUT COMPLETED ==========");
};
