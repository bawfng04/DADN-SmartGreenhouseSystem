import React from "react";
import {
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/utils/apiCall";
import { router } from "expo-router";

const AutomaticSetting: React.FC<{
  device_name: string;
  notifySave: boolean;
  setNotifySave: (notifySave: boolean) => void;
  currentSettings: string;
}> = ({ device_name, notifySave, setNotifySave, currentSettings }) => {
  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      return apiCall({
        endpoint: `/settings/${device_name}`,
        method: "PUT",
        body: {},
      });
    },
    onSuccess: () => {
      setNotifySave(false);
      console.log("🔍 saveSettingsMutation.mutate");
      router.back();
    },
    onError: (error) => {
      console.error("Error saving settings:", error);
    },
  });

  useEffect(() => {
    if (notifySave) {
      saveSettingsMutation.mutate();
    }
  }, [notifySave]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ borderRadius: 20 }}
      >
        <ImageBackground
          source={require("@/assets/images/gradient-bg.jpg")}
          style={styles.aiImage}
        >
          <Text style={styles.aiDesc}>
            Thiết bị sẽ được tự động điều khiển thông minh dựa trên dữ liệu cảm
            biến
          </Text>
        </ImageBackground>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  ButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    top: -10,
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    gap: 20,
  },
  radioButtonSection: {
    paddingHorizontal: 20,
    gap: 8,
  },
  aiDesc: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  aiImage: {
    width: 354,
    height: 200,
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
});

export default AutomaticSetting;
