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
import { useState, useEffect, useLayoutEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RadioButtonGroup, RadioButtonItem } from "expo-radio-button";
import ManualSetting from "@/components/setting/ManualSetting";
import ScheduledSetting from "@/components/setting/ScheduledSetting";
import AutomaticSetting from "@/components/setting/AutomaticSetting";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiCall } from "@/utils/apiCall";
import { useAuth } from "@/contexts/AuthContext";

const deviceNameConst = {
  led: "Đèn Led",
  fan: "Quạt",
  pump: "Bơm Nước",
};

const RadioButtonSection: React.FC<{
  initialValue: string;
  option: string;
  setOption: (option: string) => void;
}> = ({ initialValue, option, setOption }) => {
  console.log("initialValue", initialValue);
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
          value="scheduled"
          label={
            <Text>
              Hẹn giờ {"scheduled" === initialValue ? "(Hiện tại)" : ""}
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
  const router = useRouter();
  const [option, setOption] = useState("manual");
  const [initialValue, setInitialValue] = useState("manual");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [notifySave, setNotifySave] = useState(false);
  const { isAuthenticated } = useAuth();

  let initialSettings;

  const { data: deviceSetting, isSuccess } = useQuery({
    queryKey: ["settings", deviceName],
    queryFn: () => apiCall({ endpoint: `/settings/${deviceName}` }),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (deviceSetting) {
      setOption(deviceSetting.mode);
      setInitialValue(deviceSetting.mode);
    }
  }, [deviceSetting]);

  switch (option) {
    case "manual":
      initialSettings = (
        <ManualSetting
          currentSettings={initialValue}
          device_name={deviceName}
          notifySave={notifySave}
          setNotifySave={setNotifySave}
          deviceSetting={deviceSetting}
        />
      );
      break;
    case "scheduled":
      initialSettings = (
        <ScheduledSetting
          currentSettings={initialValue}
          device_name={deviceName}
          notifySave={notifySave}
          setNotifySave={setNotifySave}
          deviceSetting={deviceSetting}
        />
      );
      break;
    case "automatic":
      initialSettings = (
        <AutomaticSetting
          currentSettings={initialValue}
          device_name={deviceName}
          notifySave={notifySave}
          setNotifySave={setNotifySave}
          deviceSetting={deviceSetting}
        />
      );
      break;
    default:
      initialSettings = (
        <ManualSetting
          currentSettings={initialValue}
          device_name={deviceName}
          notifySave={notifySave}
          setNotifySave={setNotifySave}
          deviceSetting={deviceSetting}
        />
      );
  }

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {`Cài đặt ${
            deviceNameConst[device_name as keyof typeof deviceNameConst]
          }`}
        </Text>
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
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setNotifySave(true)}
        >
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
});
