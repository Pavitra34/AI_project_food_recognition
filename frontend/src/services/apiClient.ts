import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import API_BASE_URL from "../constants/api";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});
