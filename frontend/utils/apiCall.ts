import { API_URL } from "../constants/api";

interface ApiCallParams {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
}

export const apiCall = async ({
  endpoint,
  method = "GET",
  body,
}: ApiCallParams) => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const url = `${API_URL}${endpoint}`;
    console.log("📤 Sending API request:");
    console.log("➡️ URL:", url);
    console.log("➡️ Method:", method);
    if (body) console.log("➡️ Body:", body);

    const response = await fetch(url, config);
    const text = await response.text(); // đọc 1 lần để debug và parse thủ công

    console.log("📥 Raw response text:", text);

    if (!response.ok) {
      console.error("❌ HTTP status error:", response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    try {
      const data = JSON.parse(text);
      console.log("✅ Parsed JSON:", data);
      return data;
    } catch (jsonErr) {
      console.error("❌ Failed to parse JSON:", jsonErr);
      throw new Error("Response is not valid JSON");
    }
  } catch (error) {
    console.error("🚨 API call failed:", error);
    throw error;
  }
};
