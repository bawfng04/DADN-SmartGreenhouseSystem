import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export async function save(key: string, value: string | number): Promise<void> {
  try {
    if (Platform.OS === "web") {
      console.log("Web platform");
      await AsyncStorage.setItem(key, value.toString());
    } else {
      console.log("Mobile platform");
      await SecureStore.setItemAsync(key, value.toString());
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

export async function getValueFor(key: string): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      const result = await AsyncStorage.getItem(key);
      if (result) {
        console.log("Retrieved value from web storage:", result);
        return result;
      } else {
        console.log("No value found in web storage.");
        return null;
      }
    } else {
      const result = await SecureStore.getItemAsync(key);
      if (result) {
        console.log("Retrieved value from SecureStore:", result);
        return result;
      } else {
        console.log("No value found in SecureStore.");
        return null;
      }
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
}

export async function removeValueFor(key: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      console.log("Removing value from web storage...");
      await AsyncStorage.removeItem(key);
    } else {
      console.log("Removing value from SecureStore...");
      await SecureStore.deleteItemAsync(key);
    }
    console.log(`Removed value for key: ${key}`);
  } catch (error) {
    console.error("Error removing data:", error);
  }
}
