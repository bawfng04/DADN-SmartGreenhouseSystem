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
  selectedDates: { [key: string]: any };
  option: string;
  setOption: (option: string) => void;
  setSelectedDates: (value: { [key: string]: any }) => void;
}

const RadioButtonSectionWithCombobox: React.FC<Props> = ({
  selectedDates,
  option,
  setOption,
  setSelectedDates,
}) => {
  const toggleDate = (date: string) => {
    const newDates = { ...selectedDates };
    if (newDates[date]) {
      delete newDates[date]; // Bỏ chọn
    } else {
      newDates[date] = {
        selected: true,
        selectedColor: "#FFA500", // Màu cam
      };
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
        <RadioButtonItem value="repeat" label={<Text>Lặp lại vào </Text>} />
      </RadioButtonGroup>
      {option === "repeat" && (
        <View>
          <Calendar
            onDayPress={(day: any) => toggleDate(day.dateString)}
            markedDates={selectedDates}
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
}> = ({ device_name, notifySave, setNotifySave, currentSettings }) => {
  const [intensity, setIntensity] = useState("100");
  const [option, setOption] = useState("today");
  const [OffTime, setOffTime] = useState("0");
  const [OnTime, setOnTime] = useState(getTimePlus30Minutes());
  const [show, setShow] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>(
    {}
  );

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
      router.push("/setting");
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
    setIntensity(number.toString());
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
              value={intensity}
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
              value={OffTime}
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

export default ScheduledSetting;
