import Constants from "expo-constants";
import { getValueFor, removeValueFor } from "./handleAccessToken";
import { router } from "expo-router";

interface ApiCallParams {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
}

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const { apiUrl } = extra;

export const apiCall = async ({
  endpoint,
  method = "GET",
  body,
}: ApiCallParams) => {
  try {
    const token = await getValueFor("token");

    if (!token && endpoint !== "/login" && endpoint !== "/register") {
      console.warn("No token found, redirecting to login...");
      router.push("/auth/login");
      return;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (endpoint != "/login" && endpoint != "/register") {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const url = `${apiUrl}${endpoint}`;
    console.log("Sending API request:");
    console.log("URL:", url);
    console.log("Method:", method);

    const response = await fetch(url, config);
    const text = await response.text();

    console.log("Raw response text:", text);

    if (!response.ok) {
      console.error("HTTP status error:", response.status);
      await removeValueFor("token");
      router.push("/auth/login");
      return;
      // throw new Error(`HTTP error! status: ${response.status}`);
    }

    try {
      const data = JSON.parse(text);
      console.log("Parsed JSON:", data);
      return data;
    } catch (jsonErr) {
      console.error("Failed to parse JSON:", jsonErr);
      throw new Error("Response is not valid JSON");
    }
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
