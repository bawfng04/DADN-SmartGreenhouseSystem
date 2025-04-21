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

const unit = {
  temperature: "°C",
  soil_moisture: "%",
  humidity: "%",
  light: "lux",
};

interface Notification {
  timestamp: string;
  message: string;
}

const mockDeviceNotifications: Notification[] = [
  {
    timestamp: "15:30, 06/01/2025",
    message: "Quạt được bật (thủ công), cường độ 50%",
  },
  {
    timestamp: "15:30, 06/01/2025",
    message: "Quạt được tắt (tự động)",
  },
  {
    timestamp: "15:30, 06/01/2025",
    message: "Quạt được bật (thủ công), cường độ 50%",
  },
  {
    timestamp: "15:30, 06/01/2025",
    message: "Quạt được bật (thủ công), cường độ 50%",
  },
];

// const mockReminderNotifications = [
//   {
//     timestamp: "15:30, 06/01/2025",
//     message: "Quạt được bật (thủ công), cường độ 50%",
//   },
// ];

const mockReminderNotifications: Notification[] = [];

export default function NotificationScreen({ id }: { id: string }) {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [type, setType] = useState("device");

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
          mockDeviceNotifications.length > 0 &&
          mockDeviceNotifications.map((notification, index) => (
            <View key={index} style={styles.notificationCard}>
              <Text style={styles.timestamp}>{notification.timestamp}</Text>
              <Text style={styles.message}>{notification.message}</Text>
            </View>
          ))}
        {type === "device" && mockDeviceNotifications.length === 0 && (
          <View style={styles.loadingContainer}>
            <Image
              source={require("@/assets/images/empty-state.png")}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ fontSize: 28 }}>Chưa có thông báo nào</Text>
          </View>
        )}
        {type === "reminder" &&
          mockReminderNotifications.length > 0 &&
          mockReminderNotifications.map((notification, index) => (
            <View key={index} style={styles.notificationCard}>
              <Text style={styles.timestamp}>{notification.timestamp}</Text>
              <Text style={styles.message}>{notification.message}</Text>
            </View>
          ))}
        {type === "reminder" && mockReminderNotifications.length === 0 && (
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
