import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../constants/api";

export async function loginUser(email: string, password: string) {

  console.log("API URL :", `${API_BASE_URL}/auth/login`);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  console.log("HTTP Status :", response.status);

  const data = await response.json();

  console.log("API Response :", data);

  return data;
}

export async function registerUser(data: any) {

    console.log("REGISTER API");
  
    console.log(data);
  
    const response = await fetch(
      `${API_BASE_URL}/auth/register`,
      {
        method: "POST",
  
        headers: {
          "Content-Type": "application/json",
        },
  
        body: JSON.stringify(data),
      }
    );
  
    console.log("HTTP STATUS");
  
    console.log(response.status);
  
    const result = await response.json();
  
    console.log("REGISTER RESULT");
  
    console.log(result);
  
    return result;
  
  }
  
export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) {

  console.log(
    "CHANGE PASSWORD URL:",
    `${API_BASE_URL}/auth/change-password`
  );

  const response = await fetch(
    `${API_BASE_URL}/auth/change-password`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    }
  );

  console.log(
    "CHANGE PASSWORD STATUS:",
    response.status
  );

  const data = await response.json();

  console.log(
    "CHANGE PASSWORD RESPONSE:",
    data
  );

  return data;
}

export async function forgotPassword(
  email: string
) {

  console.log(
    "FORGOT PASSWORD URL:",
    `${API_BASE_URL}/auth/forgot-password`
  );

  const response = await fetch(
    `${API_BASE_URL}/auth/forgot-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email.trim().toLowerCase(),
      }),
    }
  );

  console.log(
    "FORGOT PASSWORD STATUS:",
    response.status
  );

  const data = await response.json();

  console.log(
    "FORGOT PASSWORD RESPONSE:",
    data
  );

  return data;
}


export async function resetPassword(
  email: string,
  resetToken: string,
  newPassword: string,
  confirmPassword: string
) {

  console.log(
    "RESET PASSWORD URL:",
    `${API_BASE_URL}/auth/reset-password`
  );

  const response = await fetch(
    `${API_BASE_URL}/auth/reset-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        reset_token: resetToken,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    }
  );

  console.log(
    "RESET PASSWORD STATUS:",
    response.status
  );

  const data = await response.json();

  console.log(
    "RESET PASSWORD RESPONSE:",
    data
  );

  return data;
}