import React from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { RadioButtonGroup, RadioButtonItem } from "expo-radio-button";
import { apiCall } from "@/utils/apiCall";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

interface Props {
  time: string | null;
  option: string;
  setOption: (option: string) => void;
  setTime: (value: string) => void;
}

interface DeviceType {
  name: string;
  mode: string;
  status: boolean;
  intensity: number;
  turn_off_after: string | null;
  turn_on_at: string | null;
  repeat: string | null;
  dates: string[] | null;
  updated_at: string;
}

const RadioButtonSection: React.FC<Props> = ({
  time,
  option,
  setOption,
  setTime,
}) => {
  const handleChangeTimeValue = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const value = Math.max(0, Math.min(100, Number(numericValue))).toString();
    setTime(value.toString());
  };

  return (
    <View>
      <RadioButtonGroup
        containerStyle={styles.radioButtonSection}
        selected={option}
        onSelected={(value: string) => setOption(value)}
        radioBackground="#FF9100"
        radioStyle={{ height: 20, width: 20, marginRight: 4 }}
      >
        <RadioButtonItem value="never" label={<Text>Không bao giờ</Text>} />
        <RadioButtonItem
          value="custom"
          label={
            <>
              <TextInput
                onChangeText={handleChangeTimeValue}
                value={time?.toString() || ""}
                editable={option === "custom"}
                keyboardType="numeric"
                placeholder="Enter numbers only"
                placeholderTextColor="#999"
                style={{
                  width: 40,
                  textAlign: "center",
                  backgroundColor: "#FFE9CC",
                  borderRadius: 6,
                  marginHorizontal: 8,
                  height: 40,
                }}
              />
              <Text style={{ fontSize: 14 }}>Phút</Text>
            </>
          }
        />
      </RadioButtonGroup>
    </View>
  );
};

const ManualSetting: React.FC<{
  device_name: string;
  notifySave: boolean;
  setNotifySave: (notifySave: boolean) => void;
  currentSettings: string;
  deviceSetting: DeviceType;
}> = ({
  device_name,
  notifySave,
  setNotifySave,
  currentSettings,
  deviceSetting,
}) => {
  const router = useRouter();

  const [states, setState] = useState({
    status: true,
    intensity: 100,
  });
  const [option, setOption] = useState("never");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (deviceSetting && currentSettings === "manual") {
      setState({
        status: deviceSetting.status,
        intensity: deviceSetting.intensity,
      });
      setOption(deviceSetting.turn_off_after === null ? "never" : "custom");
      setTime(deviceSetting.turn_off_after || "");
    }
  }, [deviceSetting, currentSettings]);

  console.log("body hien tai", {
    mode: "manual",
    status: states.status,
    intensity: states.intensity,
    turn_off_after: option === "never" ? null : time,
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      const intensity = Number(states.intensity);
      const turnOff = option === "never" ? null : Number(time);

      if (isNaN(intensity) || intensity < 0 || intensity > 100) {
        throw new Error("⚠️ Cường độ không hợp lệ");
      }

      const body = {
        mode: "manual",
        status: states.status,
        intensity,
        turn_off_after: turnOff,
      };

      return apiCall({
        endpoint: `/settings/${device_name}`,
        method: "PUT",
        body,
      });
    },
    onSuccess: () => {
      setNotifySave(false);
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

  const toggleSwitch = () => {
    setState((prev) => ({
      ...prev,
      status: !prev.status,
    }));
  };

  const handleChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const number = Math.max(0, Math.min(100, Number(numericValue)));
    setState((prev) => ({
      ...prev,
      intensity: number,
    }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thủ công</Text>
        <View style={styles.ButtonRow}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Trạng thái:</Text>
          <Switch
            value={states.status}
            onValueChange={toggleSwitch}
            trackColor={{ true: "#ffa500", false: "#ccc" }}
            thumbColor="#fff"
          />
        </View>
        <View style={[styles.ButtonRow, { top: -16 }]}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Cường độ: </Text>
          <TextInput
            onChangeText={handleChange}
            value={states.intensity.toString()}
            keyboardType="numeric"
            placeholder="Enter numbers only"
            placeholderTextColor="#999"
            style={{
              width: 40,
              textAlign: "center",
              backgroundColor: "#FFE9CC",
              borderRadius: 6,
              marginHorizontal: 8,
              height: 40,
            }}
          />
          <Text style={{ fontSize: 14 }}>% </Text>
        </View>
        <View style={[{ top: -20, gap: 12 }]}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Tắt sau:</Text>
          <RadioButtonSection
            time={time}
            option={option}
            setOption={setOption}
            setTime={setTime}
          />
        </View>
      </View>
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
    gap: 12,
  },
  radioButtonSection: {
    paddingHorizontal: 20,
    gap: 8,
  },
});

export default ManualSetting;
