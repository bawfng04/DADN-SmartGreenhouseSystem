import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { RadioButtonGroup, RadioButtonItem } from "expo-radio-button";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "react-native-calendars";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/utils/apiCall";

interface Props {
  selectedDates: string[];
  option: string;
  setOption: (option: string) => void;
  setSelectedDates: (value: string[]) => void;
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

const RadioButtonSectionWithCombobox: React.FC<Props> = ({
  selectedDates,
  option,
  setOption,
  setSelectedDates,
}) => {
  const toggleDate = (date: string) => {
    const newDates = [...selectedDates];
    if (newDates.includes(date)) {
      newDates.splice(newDates.indexOf(date), 1);
    } else {
      newDates.push(date);
    }
    setSelectedDates(newDates);
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
        <RadioButtonItem value="today" label={<Text>Ngày hôm nay</Text>} />
        <RadioButtonItem value="everyday" label={<Text>Mỗi ngày</Text>} />
        <RadioButtonItem value="custom" label={<Text>Lặp lại vào </Text>} />
      </RadioButtonGroup>
      {option === "custom" && (
        <View>
          <Calendar
            onDayPress={(day: any) => toggleDate(day.dateString)}
            markedDates={Object.fromEntries(
              selectedDates.map((date) => [
                date,
                { selected: true, selectedColor: "#FFA500" },
              ])
            )}
            theme={{
              selectedDayBackgroundColor: "#FFA500",
              todayTextColor: "#FF6600",
            }}
            markingType={"multi-dot"}
          />
        </View>
      )}
    </View>
  );
};

const ScheduledSetting: React.FC<{
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
  const [intensity, setIntensity] = useState(100);
  const [option, setOption] = useState("today");
  const [OffTime, setOffTime] = useState("5");
  const [OnTime, setOnTime] = useState(getTimePlus30Minutes());
  const [show, setShow] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  console.log("selectedDates", selectedDates);

  useEffect(() => {
    if (deviceSetting && currentSettings === "scheduled") {
      setIntensity(deviceSetting.intensity);
      setOption(deviceSetting.repeat || "today");
      setOffTime(deviceSetting.turn_off_after || "5");
      setOnTime(
        deviceSetting.turn_on_at
          ? parseTimeStringToDate(deviceSetting.turn_on_at)
          : getTimePlus30Minutes()
      );
      setSelectedDates(deviceSetting.dates || []);
    }
  }, [deviceSetting, currentSettings]);

  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      const body = {
        mode: "scheduled",
        status: deviceSetting.status,
        intensity: Number(intensity),
        turn_off_after: Number(OffTime),
        turn_on_at: formatTime(OnTime),
        repeat: option,
        dates: selectedDates,
      };
      console.log("body scheduled", body);
      return apiCall({
        endpoint: `/settings/${device_name}`,
        method: "PUT",
        body,
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

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setOnTime(selectedDate);
    }
  };

  const showTimepicker = () => {
    setShow(true);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleChangeIntensity = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const number = Math.max(0, Math.min(100, Number(numericValue)));
    setIntensity(number);
  };

  const handleChangeOffTime = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const number = Math.max(0, Math.min(100, Number(numericValue)));
    setOffTime(number.toString());
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ borderRadius: 20 }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hẹn giờ</Text>
          <View style={[styles.ButtonRow, { top: -16 }]}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Cường độ: </Text>
            <TextInput
              onChangeText={handleChangeIntensity}
              value={intensity.toString()}
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
          <View style={[{ gap: 12 }]}>
            <View style={[styles.ButtonRow, { top: -16 }]}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Bật lúc:{" "}
              </Text>
              <TouchableOpacity
                onPress={showTimepicker}
                style={{
                  width: 50,
                  backgroundColor: "#FFE9CC",
                  borderRadius: 6,
                  marginHorizontal: 8,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{formatTime(OnTime)}</Text>
                {show && (
                  <DateTimePicker
                    value={OnTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                  />
                )}
              </TouchableOpacity>
            </View>
            <RadioButtonSectionWithCombobox
              selectedDates={selectedDates}
              option={option}
              setOption={setOption}
              setSelectedDates={setSelectedDates}
            />
          </View>
          <View style={[styles.ButtonRow, { top: -12 }]}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Tắt sau: </Text>
            <TextInput
              onChangeText={handleChangeOffTime}
              value={OffTime.toString()}
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
    top: -12,
  },
});

const getTimePlus30Minutes = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  return now;
};

function parseTimeStringToDate(timeStr: string): Date {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  const now = new Date();
  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(seconds || 0);
  now.setMilliseconds(0);
  return now;
}

export default ScheduledSetting;
