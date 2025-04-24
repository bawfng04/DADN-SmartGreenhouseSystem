import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import { Card, Title } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "@/utils/apiCall";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

interface DeviceState {
  id: string;
  name: string;
  value: string;
}

interface EquipmentState {
  id: string;
  name: string;
  status: boolean;
}

const indicesIcon = {
  temperature: {
    icon: require("@/assets/images/Temperature.png"),
    unit: "°C",
    name: "Nhiệt độ",
  },
  humidity: {
    icon: require("@/assets/images/Humidity.png"),
    unit: "%",
    name: "Độ ẩm không khí",
  },
  "soil-moisture": {
    icon: require("@/assets/images/SoilMoisture.png"),
    unit: "%",
    name: "Độ ẩm đất",
  },
  light: {
    icon: require("@/assets/images/Sunlight.png"),
    unit: "lux",
    name: "Cường độ ánh sáng",
  },
};

const equipmentIcon = {
  led: {
    icon: require("@/assets/images/led.png"),
    name: "Đèn LED",
  },
  fan: {
    icon: require("@/assets/images/fan.png"),
    name: "Quạt",
  },
  pump: {
    icon: require("@/assets/images/pump.png"),
    name: "Bơm nước",
  },
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isNotification, setIsNotification] = useState(false);
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());

  const {
    data: indices,
    isSuccess: isSuccessIndices,
    refetch: refetchIndices,
  } = useQuery({
    queryKey: ["indices"],
    queryFn: async () => {
      const response = await apiCall({ endpoint: "/indices" });
      console.log("✅ response from API:", response);
      return response;
    },
  });

  const {
    data: settings,
    isSuccess: isSuccessSettings,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await apiCall({ endpoint: "/settings" });
      console.log("✅ Settings response from API:", response);
      return response;
    },
  });

  const handleRefresh = () => {
    console.log("🔄 Refreshing indices...");
    setCurrentDate(new Date());
    refetchIndices();
    refetchSettings();
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [])
  );

  const formattedDate = currentDate.toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleNotification = () => {
    router.push("/home/notification");
  };

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headingText}>Hello, user!</Text>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={handleNotification}
          >
            {isNotification && (
              <Image
                source={require("@/assets/images/active.png")}
                style={{ width: 20, height: 20 }}
              />
            )}
            {!isNotification && (
              <Image
                source={require("@/assets/images/notification.png")}
                style={{ width: 20, height: 20 }}
              />
            )}
          </TouchableOpacity>
        </View>

        <Card style={styles.areaCard}>
          <Image
            source={require("@/assets/images/user-background.png")}
            style={styles.areaImage}
          />
          <View style={styles.areaOverlay}>
            <View>
              <Text style={styles.areaTitle}>Khu đất ABC</Text>
              <Text style={styles.areaDate}>{formattedDate}</Text>
            </View>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.metricsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Chỉ số</Title>
            {isSuccessIndices &&
              indices.map((index: any, id: number) => (
                <View key={id} style={styles.metricItem}>
                  <Image
                    source={
                      indicesIcon[index.name as keyof typeof indicesIcon].icon
                    }
                    style={styles.metricIcon}
                  />
                  <Text style={styles.metricName}>
                    {indicesIcon[index.name as keyof typeof indicesIcon].name}
                  </Text>
                  <Text style={styles.metricValue}>
                    {index.value}{" "}
                    {indicesIcon[index.name as keyof typeof indicesIcon].unit}
                  </Text>
                </View>
              ))}
          </Card.Content>
        </Card>

        <Card style={styles.devicesCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Thiết bị</Title>
            {isSuccessSettings &&
              settings.map((setting: any, index: number) => (
                <View key={index} style={styles.deviceItem}>
                  <Image
                    source={
                      equipmentIcon[setting.name as keyof typeof equipmentIcon]
                        .icon
                    }
                    style={styles.deviceIcon}
                  />
                  <Text style={styles.deviceName}>
                    {
                      equipmentIcon[setting.name as keyof typeof equipmentIcon]
                        .name
                    }
                  </Text>
                  <Text style={styles.deviceStatus}>
                    {setting.status ? "Bật" : "Tắt"}
                  </Text>
                </View>
              ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecffe1",
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  headingText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  notificationButton: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    color: "#fff",
    fontWeight: "600",
  },
  areaCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  areaImage: {
    width: "100%",
    height: 135,
    opacity: 0.5,
  },
  areaOverlay: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  areaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  areaDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 4,
  },
  refreshButton: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  refreshText: {
    color: "#fff",
    fontWeight: "600",
  },
  metricsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
  },
  devicesCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metricIcon: {
    marginRight: 12,
    width: 28,
    height: 28,
  },
  metricName: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  metricValue: {
    fontSize: 16,
    color: "#000",
    // fontWeight: "500",
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  deviceIcon: {
    marginRight: 12,
    width: 28,
    height: 28,
  },
  deviceName: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  deviceStatus: {
    fontSize: 16,
    color: "#000",
    // fontWeight: "500",
  },
});
