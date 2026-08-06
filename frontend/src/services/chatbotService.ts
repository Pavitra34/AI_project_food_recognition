import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "./apiClient";

export type ChatResponse = {
  reply: string;
};

export const sendMessage = async (
  message: string
): Promise<ChatResponse> => {
  const response = await apiClient.post<ChatResponse>(
    "/chat",
    {
      message,
    }
  );

  return response.data;
};