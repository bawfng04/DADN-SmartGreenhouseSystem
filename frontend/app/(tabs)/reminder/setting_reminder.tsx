import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Switch,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useLayoutEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RadioButtonGroup, RadioButtonItem } from "expo-radio-button";
import { apiCall } from "@/utils/apiCall";
import { useMutation } from "@tanstack/react-query";

const unit = {
  temperature: "°C",
  soil_moisture: "%",
  humidity: "%",
  light: "lux",
};

const RadioButtonSection: React.FC<{
  option: string;
  setOption: (option: string) => void;
}> = ({ option, setOption }) => {
  return (
    <View>
      <RadioButtonGroup
        containerStyle={styles.radioButtonSection}
        selected={option}
        onSelected={(value: string) => setOption(value)}
        radioBackground="#FF9100"
        radioStyle={{ height: 20, width: 20, marginRight: 4 }}
      >
        <RadioButtonItem value="temperature" label={<Text>Nhiệt độ</Text>} />
        <RadioButtonItem
          value="humidity"
          label={<Text>Độ ẩm không khí</Text>}
        />
        <RadioButtonItem value="soil_moisture" label={<Text>Độ ẩm đất</Text>} />
        <RadioButtonItem value="light" label={<Text>Cường độ ánh sáng</Text>} />
      </RadioButtonGroup>
    </View>
  );
};

const SettingReminder: React.FC<{
  id: string;
  option: string;
  notifySave: boolean;
  setNotifySave: (notifySave: boolean) => void;
  setState: (state: any) => void;
  currentSettings: {
    lowerThan: {
      value: number | null;
      status: boolean;
    };
    higherThan: {
      value: number | null;
      status: boolean;
    };
    repeatAfter: {
      value: number | null;
      status: boolean;
    };
  };
}> = ({ id, notifySave, setNotifySave, currentSettings, option, setState }) => {
  const router = useRouter();

  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        index: option,
        lowerThan: {
          value: currentSettings.lowerThan.value ?? 0,
          status: currentSettings.lowerThan.status,
        },
        higherThan: {
          value: currentSettings.higherThan.value ?? 0,
          status: currentSettings.higherThan.status,
        },
        repeatAfter: {
          value: currentSettings.repeatAfter.value ?? 0,
          status: currentSettings.repeatAfter.status,
        },
      };
      console.log("📤 Sending reminder body:", payload);
      return apiCall({
        endpoint: `/reminders`,
        method: "POST",
        body: payload,
      });
    },
    onSuccess: () => {
      setNotifySave(false);
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

  const toggleSwitch = (index: string) => {
    setState((prev: any) => ({
      ...prev,
      [index]: {
        value: prev[index].value,
        status: !prev[index].status,
      },
    }));
  };

  const handleChange = (text: string, index: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const number = Math.max(0, Math.min(100, Number(numericValue)));
    setState((prev: any) => ({
      ...prev,
      [index]: {
        value: number,
        status: prev[index].status,
      },
    }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nhắc nhở</Text>

        <View style={[styles.ButtonRow]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              Khi cao hơn:{" "}
            </Text>
            <TextInput
              onChangeText={(text) => handleChange(text, "higherThan")}
              value={currentSettings.higherThan.value?.toString() || ""}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
              style={styles.input}
              maxLength={2}
            />
            <Text style={{ fontSize: 14 }}>
              {" "}
              {unit[option as keyof typeof unit]}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Switch
              value={currentSettings.higherThan.status}
              onValueChange={() => toggleSwitch("higherThan")}
              trackColor={{ true: "#ffa500", false: "#ccc" }}
              thumbColor="#fff"
            />
          </View>
        </View>
        <View style={[styles.ButtonRow]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              Khi thấp hơn:{" "}
            </Text>
            <TextInput
              onChangeText={(text) => handleChange(text, "lowerThan")}
              value={currentSettings.lowerThan.value?.toString() || ""}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
              style={styles.input}
              maxLength={2}
            />
            <Text style={{ fontSize: 14 }}>
              {" "}
              {unit[option as keyof typeof unit]}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Switch
              value={currentSettings.lowerThan.status}
              onValueChange={() => toggleSwitch("lowerThan")}
              trackColor={{ true: "#ffa500", false: "#ccc" }}
              thumbColor="#fff"
            />
          </View>
        </View>
        <View style={[styles.ButtonRow]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              Lặp lại sau:{" "}
            </Text>
            <TextInput
              onChangeText={(text) => handleChange(text, "repeatAfter")}
              value={currentSettings.repeatAfter.value?.toString() || ""}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
              style={styles.input}
              maxLength={2}
            />
            <Text style={{ fontSize: 14 }}> phút</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Switch
              value={currentSettings.repeatAfter.status}
              onValueChange={() => toggleSwitch("repeatAfter")}
              trackColor={{ true: "#ffa500", false: "#ccc" }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default function ConfigScreen({ id }: { id: string }) {
  const initialValue = "temperature";
  const router = useRouter();
  const [option, setOption] = useState(initialValue);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [notifySave, setNotifySave] = useState(false);
  const [states, setState] = useState({
    lowerThan: {
      value: 0,
      status: false,
    },
    higherThan: {
      value: 0,
      status: false,
    },
    repeatAfter: {
      value: 0,
      status: false,
    },
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useLayoutEffect(() => {
    const parent = navigation.getParent();

    parent?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      parent?.setOptions({
        tabBarStyle: {
          position: "absolute",
          bottom: 12,
          left: 20,
          right: 20,
          backgroundColor: "#00712D",
          borderRadius: 30,
          height: 68,
          marginHorizontal: 20,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "row",
          paddingBottom: 28,
          ...styles.shadow,
        },
      });
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 20,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Trở về</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chỉ số</Text>
            <RadioButtonSection option={option} setOption={setOption} />
          </View>

          <SettingReminder
            id={id}
            notifySave={notifySave}
            setNotifySave={setNotifySave}
            currentSettings={states}
            option={option}
            setState={setState}
          />

          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: "#FF7F00", fontWeight: "bold" }}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setNotifySave(true)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecffe1",
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  ButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    top: 0,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    alignItems: "center",
    marginTop: "auto",
  },
  saveButton: {
    backgroundColor: "#FF7F00",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
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
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  input: {
    width: 40,
    textAlign: "center",
    backgroundColor: "#FFE9CC",
    borderRadius: 6,
  },
});
