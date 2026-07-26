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