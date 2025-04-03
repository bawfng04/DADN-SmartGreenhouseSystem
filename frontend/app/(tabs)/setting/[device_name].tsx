import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RadioButtonGroup, RadioButtonItem } from "expo-radio-button";
import ManualSetting from "@/components/setting/ManualSetting";
import ScheduledSetting from "@/components/setting/ScheduledSetting";
import AutomaticSetting from "@/components/setting/AutomaticSetting";

const RadioButtonSection: React.FC<{
  initialValue: string;
  option: string;
  setOption: (option: string) => void;
}> = ({ initialValue, option, setOption }) => {
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
          value="manual"
          label={
            <Text>
              Thủ công {"manual" === initialValue ? "(Hiện tại)" : ""}
            </Text>
          }
        />
        <RadioButtonItem
          value="schedule"
          label={
            <Text>
              Hẹn giờ {"schedule" === initialValue ? "(Hiện tại)" : ""}
            </Text>
          }
        />
        <RadioButtonItem
          value="automatic"
          label={
            <Text>
              Tự động {"automatic" === initialValue ? "(Hiện tại)" : ""}
            </Text>
          }
        />
      </RadioButtonGroup>
    </View>
  );
};

export default function ConfigScreen() {
  const { device_name } = useLocalSearchParams();
  const deviceName = device_name as string;
  const initialValue = "manual";
  const router = useRouter();
  const [option, setOption] = useState(initialValue);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [notifySave, setNotifySave] = useState(false);

  let initialSettings;

  switch (option) {
    case "manual":
      initialSettings = (
        <ManualSetting
          currentSettings={initialValue}
          device_name={deviceName}
          notifySave={notifySave}
          setNotifySave={setNotifySave}
        />
      );
      break;
    case "schedule":
      initialSettings = <ScheduledSetting />;
      break;
    case "automatic":
      initialSettings = <AutomaticSetting />;
      break;
    default:
      initialSettings = (
        <ManualSetting
          currentSettings={initialValue}
          device_name={deviceName}
          notifySave={notifySave}
          setNotifySave={setNotifySave}
        />
      );
  }

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 20,
      }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Cài đặt {device_name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chế độ điều khiển</Text>
        <RadioButtonSection
          initialValue={initialValue}
          option={option}
          setOption={setOption}
        />
      </View>

      {initialSettings}

      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#FF7F00", fontWeight: "bold" }}>Huỷ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Lưu</Text>
        </TouchableOpacity>
      </View>
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
    alignSelf: "flex-start",
    top: -10,
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
});
