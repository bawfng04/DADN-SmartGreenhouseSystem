import React from "react";
import { useRouter } from "expo-router";
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
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useLayoutEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNotifications } from "@/contexts/NotificationContext";

const unit = {
  temperature: "°C",
  soil_moisture: "%",
  humidity: "%",
  light: "lux",
};
const device = {
  fan: "Quạt",
  led: "Đèn",
  pump: "Bơm",
};
const mode = {
  manual: "Thủ công",
  scheduled: "Hẹn giờ",
  automatic: "Tự động",
};

const sensor = {
  temperature: "Nhiệt độ",
  soil_moisture: "Độ ẩm đất",
  humidity: "Độ ẩm không khí",
  light: "Ánh sáng",
};

interface DeviceMessage {
  type: string;
  payload: {
    name: string;
    mode: string;
    status: boolean;
    intensity: number;
    turn_off_after: string | null;
    turn_on_at: string | null;
    repeat: string | null;
    dates: string | null;
    updated_at: string;
  };
}

interface SensorMessage {
  type: string;
  payload: {
    id: string;
    index: string;
    higherThan: number | null;
    lowerThan: number | null;
    repeatAfter: number | null;
    active: boolean;
    updated_at: string;
  };
}

// const mockReminderNotifications = [
//   {
//     timestamp: "15:30, 06/01/2025",
//     message: "Quạt được bật (thủ công), cường độ 50%",
//   },
// ];

export default function NotificationScreen({ id }: { id: string }) {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [type, setType] = useState("device");
  const { notifications } = useNotifications();
  const deviceNotifications: DeviceMessage[] = notifications.filter(
    (notification) => notification.type === "DEVICE_UPDATE"
  ) as DeviceMessage[];
  const sensorNotifications: SensorMessage[] = notifications.filter(
    (notification) => notification.type === "SENSOR_ALERT"
  ) as SensorMessage[];

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
        <Text style={styles.title}>Trở về</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setType("device")}
          style={[styles.tab, type === "device" && styles.tabSelected]}
        >
          <Text style={[type === "device" && styles.textSelected, styles.text]}>
            Thiết bị
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setType("reminder")}
          style={[styles.tab, type === "reminder" && styles.tabSelected]}
        >
          <Text
            style={[type === "reminder" && styles.textSelected, styles.text]}
          >
            Nhắc nhở
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notificationList}>
        {type === "device" &&
          deviceNotifications.length > 0 &&
          deviceNotifications.map((notification, index) => (
            <View key={index} style={styles.notificationCard}>
              <Text style={styles.timestamp}>
                {formatDateTime(notification.payload.updated_at)}
              </Text>
              <Text style={styles.message}>
                {formatDeviceMessage(notification)}
              </Text>
            </View>
          ))}

        {type === "device" && deviceNotifications.length === 0 && (
          <View style={styles.loadingContainer}>
            <Image
              source={require("@/assets/images/empty-state.png")}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ fontSize: 28 }}>Chưa có thông báo nào</Text>
          </View>
        )}
        {type === "reminder" &&
          sensorNotifications.length > 0 &&
          sensorNotifications.map((notification, index) => (
            <View key={index} style={styles.notificationCard}>
              <Text style={styles.timestamp}>
                {formatDateTime(notification.payload.updated_at)}
              </Text>
              <Text style={styles.message}>
                {formatSensorMessage(notification)}
              </Text>
            </View>
          ))}
        {type === "reminder" && sensorNotifications.length === 0 && (
          <View style={styles.loadingContainer}>
            <Image
              source={require("@/assets/images/empty-state.png")}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ fontSize: 28 }}>Chưa có lời nhắc nào</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${hours}:${minutes}, ${day}-${month}-${year}`;
}

function formatDeviceMessage(message: DeviceMessage): string {
  const deviceName = message.payload.name as keyof typeof device;
  const deviceMode = message.payload.mode as keyof typeof mode;
  return `${device[deviceName]} được ${
    message.payload.status ? "bật" : "tắt"
  } (${mode[deviceMode]}) ${
    message.payload.status ? `, cường độ ${message.payload.intensity}%` : ""
  }`;
}

function formatSensorMessage(message: SensorMessage): string {
  const sensorName = message.payload.index as keyof typeof sensor;
  return `${sensor[sensorName]} ${
    message.payload.higherThan ? "cao hơn " + message.payload.higherThan : ""
  } ${
    message.payload.lowerThan ? "thấp hơn " + message.payload.lowerThan : ""
  } ${unit[sensorName as keyof typeof unit] || ""}`;
}

// function formatSensorMessage(message: SensorMessage): string {
//   const sensorName = message.payload.name as string;
//   return `Cảnh báo: ${sensorName} đã ${message.payload.status ? "vượt ngưỡng" : "trở lại bình thường"}, giá trị hiện tại: ${message.payload.intensity}${unit[sensorName as keyof typeof unit] || ''}`;
// }

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
  headerSubtitle: {
    fontSize: 16,
    color: "#FF9100",
  },
  notificationList: {
    flex: 1,
  },
  notificationCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#000",
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
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#FFD7A2",
  },
  tabSelected: {
    borderBottomColor: "#FF9100",
    backgroundColor: "#EFF4CD",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 2,
  },
  textSelected: {
    color: "#FF9100",
    fontWeight: "bold",
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    color: "#FF9100",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 140,
  },
});
