import React, { useState } from "react";
import SettingsIcon from "@/assets/icons/setting-fill-22.svg";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

interface DeviceType {
  id: number;
  name: string;
  mode: string;
  icon: any;
}

const devices = [
  {
    id: 1,
    name: "Đèn LED",
    mode: "Thủ công",
    icon: require("@/assets/images/led.png"),
  },
  {
    id: 2,
    name: "Quạt",
    mode: "Tự động",
    icon: require("@/assets/images/fan.png"),
  },
  {
    id: 3,
    name: "Bơm nước",
    mode: "Hẹn giờ",
    icon: require("@/assets/images/pump.png"),
  },
];

const CardDevice: React.FC<DeviceType> = ({ id, icon, name, mode }) => {
  const router = useRouter();
  const [states, setState] = useState({ status: true, intensity: 0 });

  const toggleSwitch = () => {
    setState((prev) => ({
      ...prev,
      status: !prev.status,
    }));
  };

  return (
    <View style={styles.card}>
      <View style={styles.LeftSection}>
        <Image source={icon} style={styles.icon} />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.ButtonRow}>
            <Text style={styles.label}>Trạng thái:</Text>
            <Switch
              value={states.status}
              onValueChange={() => toggleSwitch()}
              trackColor={{ false: "#ccc", true: "#ffa500" }}
              thumbColor="#fff"
            />
          </View>
          <Text style={styles.label}>Cường độ: {states.intensity}%</Text>
        </View>
      </View>
      <View style={styles.ControlSection}>
        <Text style={styles.mode}>{mode}</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            router.push({
              pathname: "/setting/[device_name]",
              params: { device_name: name },
            } as const)
          }
        >
          <SettingsIcon width={22} height={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function SettingTab() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom,
      }}
    >
      {devices.map((device, index) => (
        <CardDevice key={index} {...device} />
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecffe1",
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",
    elevation: 4,
    height: 152,
    width: "100%",
    gap: 12,
  },
  icon: {
    width: 82,
    height: 82,
    resizeMode: "contain",
  },
  info: {
    flexDirection: "column",
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  mode: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  ControlSection: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  label: {
    fontSize: 14,
    marginRight: 6,
  },
  LeftSection: {
    gap: 12,
    flexDirection: "row",
  },
  iconButton: {
    backgroundColor: "#00712D",
    padding: 4,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
