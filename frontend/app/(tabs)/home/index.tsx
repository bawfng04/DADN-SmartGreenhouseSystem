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

interface DeviceState {
  id: string;
  name: string;
  value: string;
  icon: ImageSourcePropType;
}

interface EquipmentState {
  id: string;
  name: string;
  status: boolean;
  icon: ImageSourcePropType;
}

const deviceStates: DeviceState[] = [
  {
    id: "1",
    name: "Nhiệt độ",
    value: "23 °C",
    icon: require("@/assets/images/Temperature.png"),
  },
  {
    id: "2",
    name: "Độ ẩm không khí",
    value: "50 %",
    icon: require("@/assets/images/Humidity.png"),
  },
  {
    id: "3",
    name: "Độ ẩm đất",
    value: "50 %",
    icon: require("@/assets/images/SoilMoisture.png"),
  },
  {
    id: "4",
    name: "Cường độ ánh sáng",
    value: "300 lux",
    icon: require("@/assets/images/Sunlight.png"),
  },
];

const equipmentStates: EquipmentState[] = [
  {
    id: "1",
    name: "Đèn LED",
    status: true,
    icon: require("@/assets/images/led.png"),
  },
  {
    id: "2",
    name: "Quạt",
    status: true,
    icon: require("@/assets/images/fan.png"),
  },
  {
    id: "3",
    name: "Bơm nước",
    status: false,
    icon: require("@/assets/images/pump.png"),
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isNotification, setIsNotification] = useState(false);
  const router = useRouter();

  const date = new Date();
  const formattedDate = date.toLocaleDateString("vi-VN", {
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
                style={{ width: 24, height: 24 }}
              />
            )}
            {!isNotification && (
              <Image
                source={require("@/assets/images/notification.png")}
                style={{ width: 24, height: 24 }}
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
            <TouchableOpacity style={styles.refreshButton}>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.metricsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Chỉ số</Title>
            {deviceStates.map((device) => (
              <View key={device.id} style={styles.metricItem}>
                <Image source={device.icon} style={styles.metricIcon} />
                <Text style={styles.metricName}>{device.name}</Text>
                <Text style={styles.metricValue}>{device.value}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.devicesCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Thiết bị</Title>
            {equipmentStates.map((equipment) => (
              <View key={equipment.id} style={styles.deviceItem}>
                <Image source={equipment.icon} style={styles.deviceIcon} />
                <Text style={styles.deviceName}>{equipment.name}</Text>
                <Text style={styles.deviceStatus}>
                  {equipment.status ? "Bật" : "Tắt"}
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
    borderRadius: 15,
    width: 40,
    height: 40,
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
