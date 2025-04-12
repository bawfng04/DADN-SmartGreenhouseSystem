import React from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { RadioButtonGroup, RadioButtonItem } from "expo-radio-button";
import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/utils/apiCall";
import { router } from "expo-router";

interface Props {
  option: string;
  setOption: (option: string) => void;
}

interface ParameterSettingProps {
  title: string;
  unit: string;
  status: boolean;
  setStatus: (status: boolean) => void;
  value: {
    min: string;
    max: string;
  };
  setValue: (value: { min: string; max: string }) => void;
}

interface SensorState {
  status: boolean;
  min: string;
  max: string;
}

interface SensorStates {
  temperature: SensorState;
  humidity: SensorState;
  light: SensorState;
  soilMoisture: SensorState;
}

const RadioButtonSection: React.FC<Props> = ({ option, setOption }) => {
  return (
    <View>
      <RadioButtonGroup
        containerStyle={styles.radioButtonSection}
        selected={option}
        onSelected={(value: string) => setOption(value)}
        radioBackground="#FF9100"
        radioStyle={{ height: 20, width: 20, marginRight: 4 }}
      >
        <RadioButtonItem
          value="all"
          label={<Text>Tất cả điều kiện thõa</Text>}
        />
        <RadioButtonItem
          value="any"
          label={<Text>Một trong những điều kiện thõa</Text>}
        />
      </RadioButtonGroup>
    </View>
  );
};

const ParameterSetting: React.FC<ParameterSettingProps> = ({
  title,
  unit,
  status,
  setStatus,
  value,
  setValue,
}) => {
  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          {title}:
        </Text>
        <Switch
          value={status}
          onValueChange={setStatus}
          trackColor={{ true: "#ffa500", false: "#ccc" }}
          thumbColor="#fff"
        />
      </View>
      {status && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 20,
            paddingHorizontal: 40,
          }}
        >
          <View style={[styles.ButtonRow, { top: -16 }]}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Min: </Text>
            <TextInput
              onChangeText={(text) => setValue({ ...value, min: text })}
              value={value.min}
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
            <Text style={{ fontSize: 14 }}>{unit}</Text>
          </View>
          <View style={[styles.ButtonRow, { top: -16 }]}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Max: </Text>
            <TextInput
              onChangeText={(text) => setValue({ ...value, max: text })}
              value={value.max}
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
            <Text style={{ fontSize: 14 }}>{unit}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const AutomaticSetting: React.FC<{
  device_name: string;
  notifySave: boolean;
  setNotifySave: (notifySave: boolean) => void;
  currentSettings: string;
}> = ({ device_name, notifySave, setNotifySave, currentSettings }) => {
  const [states, setState] = useState({ status: true, intensity: "0" });
  const [option, setOption] = useState("all");

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
      //------------------------TEMP---------------------------------
      // setNotifySave(false);
      // router.push("/setting");
      //-------------------------------------------------------------
      console.error("Error saving settings:", error);
    },
  });

  useEffect(() => {
    if (notifySave) {
      saveSettingsMutation.mutate();
    }
  }, [notifySave]);

  const initialSensorState: SensorState = {
    status: false,
    min: "0",
    max: "0",
  };

  const [sensorStates, setSensorStates] = useState<SensorStates>({
    temperature: initialSensorState,
    humidity: initialSensorState,
    light: initialSensorState,
    soilMoisture: initialSensorState,
  });

  const toggleSensorSwitch = (sensor: keyof SensorStates) => {
    setSensorStates((prev) => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        status: !prev[sensor].status,
      },
    }));
  };

  const handleSensorChange = (
    sensor: keyof SensorStates,
    value: { min: string; max: string }
  ) => {
    const minNumeric = value.min.replace(/[^0-9]/g, "");
    const maxNumeric = value.max.replace(/[^0-9]/g, "");

    const minValue = Math.max(0, Math.min(100, Number(minNumeric))).toString();
    const maxValue = Math.max(0, Math.min(100, Number(maxNumeric))).toString();

    setSensorStates((prev) => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        min: minValue,
        max: maxValue,
      },
    }));
  };

  const toggleSwitchTemperature = () => toggleSensorSwitch("temperature");
  const toggleSwitchHumidity = () => toggleSensorSwitch("humidity");
  const toggleSwitchLight = () => toggleSensorSwitch("light");
  const toggleSwitchSoilMoisture = () => toggleSensorSwitch("soilMoisture");

  const handleChangeTemperature = (value: { min: string; max: string }) =>
    handleSensorChange("temperature", value);
  const handleChangeHumidity = (value: { min: string; max: string }) =>
    handleSensorChange("humidity", value);
  const handleChangeLight = (value: { min: string; max: string }) =>
    handleSensorChange("light", value);
  const handleChangeSoilMoisture = (value: { min: string; max: string }) =>
    handleSensorChange("soilMoisture", value);

  const { temperature, humidity, light, soilMoisture } = sensorStates;

  const handleChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const number = Math.max(0, Math.min(100, Number(numericValue)));
    setState((prev) => ({
      ...prev,
      intensity: number.toString(),
    }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ borderRadius: 20 }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tự động</Text>
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
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Bật khi:</Text>
            <RadioButtonSection option={option} setOption={setOption} />
          </View>
          <View style={{ top: -20 }}>
            <ParameterSetting
              title="Nhiệt độ"
              unit="°C"
              status={temperature.status}
              setStatus={toggleSwitchTemperature}
              value={{ min: temperature.min, max: temperature.max }}
              setValue={handleChangeTemperature}
            />
            <ParameterSetting
              title="Độ ẩm không khí"
              unit="%"
              status={humidity.status}
              setStatus={toggleSwitchHumidity}
              value={{ min: humidity.min, max: humidity.max }}
              setValue={handleChangeHumidity}
            />
            <ParameterSetting
              title="Độ ẩm đất"
              unit="%"
              status={soilMoisture.status}
              setStatus={toggleSwitchSoilMoisture}
              value={{ min: soilMoisture.min, max: soilMoisture.max }}
              setValue={handleChangeSoilMoisture}
            />
            <ParameterSetting
              title="Ánh sáng"
              unit="lux"
              status={light.status}
              setStatus={toggleSwitchLight}
              value={{ min: light.min, max: light.max }}
              setValue={handleChangeLight}
            />
          </View>
        </View>
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
});

export default AutomaticSetting;
