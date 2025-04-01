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
import { useState } from "react";
import { RadioButtonGroup, RadioButtonItem } from "expo-radio-button";

interface Props {
  time: string;
  option: string;
  setOption: (option: string) => void;
  setTime: (value: string) => void;
}

const RadioButtonSectionWithCombobox: React.FC<Props> = ({
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

const AutomaticSetting: React.FC = () => {
  const [states, setState] = useState({ status: true, intensity: "0" });
  const [option, setOption] = useState("all");
  const [time, setTime] = useState("0");

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
      intensity: number.toString(),
    }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            }}
          />
          <Text style={{ fontSize: 14 }}>% </Text>
        </View>
        <View style={[{ top: -20, gap: 12 }]}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Bật khi:</Text>
          <RadioButtonSectionWithCombobox
            time={time}
            option={option}
            setOption={setOption}
            setTime={setTime}
          />
        </View>
        <View style={styles.ButtonRow}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Trạng thái:</Text>
          <Switch
            value={states.status}
            onValueChange={toggleSwitch}
            trackColor={{ true: "#ffa500", false: "#ccc" }}
            thumbColor="#fff"
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
    gap: 20,
  },
  radioButtonSection: {
    paddingHorizontal: 20,
    gap: 8,
  },
});

export default AutomaticSetting;
