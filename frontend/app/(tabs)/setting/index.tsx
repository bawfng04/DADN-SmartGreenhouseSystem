import React, { useState, useEffect, useCallback } from "react";
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
import { useFocusEffect, useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiCall } from "@/utils/apiCall";
import settingsMockData from "@/data/settings.mock.json";
import { useAuth } from "@/contexts/AuthContext";
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

const devicesImage = {
  led: require("@/assets/images/led.png"),
  fan: require("@/assets/images/fan.png"),
  pump: require("@/assets/images/pump.png"),
};

const deviceName = {
  led: "Đèn Led",
  fan: "Quạt",
  pump: "Bơm Nước",
};

const modeName = {
  manual: "Thủ công",
  automatic: "Tự động",
  scheduled: "Hẹn giờ",
};

const CardDevice: React.FC<DeviceType> = ({
  name,
  mode,
  status,
  intensity,
}) => {
  const router = useRouter();
  const [updateStatus, setUpdateStatus] = useState(status);

  const toggleSwitch = () => {
    setUpdateStatus((prev) => !prev);
    saveSettingsMutation.mutate();
  };

  useEffect(() => {
    setUpdateStatus(status);
  }, [status]);

  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      return apiCall({
        endpoint: `/settings/${name}`,
        method: "PUT",
        body: {
          status: updateStatus,
        },
      });
    },
    onError: (error) => {
      setUpdateStatus((prev) => !prev);
      console.error("Error saving settings:", error);
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.LeftSection}>
        <Image
          source={devicesImage[name as keyof typeof devicesImage]}
          style={styles.icon}
        />
        <View style={styles.info}>
          <Text style={styles.name}>
            {deviceName[name as keyof typeof deviceName]}
          </Text>
          <View style={styles.ButtonRow}>
            <Text style={styles.label}>Trạng thái:</Text>
            <Switch
              value={updateStatus}
              onValueChange={toggleSwitch}
              trackColor={{ false: "#ccc", true: "#ffa500" }}
              thumbColor="#fff"
            />
          </View>
          <Text style={styles.label}>Cường độ: {intensity}%</Text>
        </View>
      </View>
      <View style={styles.ControlSection}>
        <Text style={styles.mode}>
          {modeName[mode as keyof typeof modeName]}
        </Text>
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
  const [deviceList, setDeviceList] = useState<DeviceType[]>([]);
  const { isAuthenticated } = useAuth();
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const {
    data: settings,
    isSuccess,
    isError,
    refetch,
  } = useQuery<any>({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await apiCall({ endpoint: `/settings` });
      return response ?? [];
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (settings) {
      console.log("settings here", settings);
      setDeviceList(settings);
    }
  }, [settings]);

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 20,
      }}
    >
      {deviceList.map((device: DeviceType, index: number) => (
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
