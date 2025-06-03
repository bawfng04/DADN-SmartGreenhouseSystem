import React, { useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageSourcePropType,
  Switch,
  Button,
} from "react-native";
import { Card, Title } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const { removeToken } = useAuth();

  const toggleNotification = () => {
    setIsNotification(!isNotification);
  };

  const handleLogout = () => {
    setIsLoggedOut(!isLoggedOut);
    removeToken();
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: insets.top + 80,
        paddingBottom: insets.bottom,
      }}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={require("@/assets/images/avatar.png")}
          width={68}
          height={68}
        />
        <Text style={styles.avatarTitle}>Nguyễn Văn A</Text>
      </View>
      <View style={{ gap: 8 }}>
        <View style={styles.contentRow}>
          <Text style={{ fontSize: 18 }}>Thông báo</Text>
          <Switch
            value={isNotification}
            onValueChange={toggleNotification}
            trackColor={{ false: "#ccc", true: "#ffa500" }}
            thumbColor="#fff"
          />
        </View>
        {/* <Text style={{ fontSize: 18 }}>Đăng xuất</Text>
          <Image
            source={require("@/assets/images/Logout.png")}
            style={{ marginRight: 12 }}
          /> */}
        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={{ color: "#E83F25", fontWeight: "bold", fontSize: 18 }}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecffe1",
    paddingHorizontal: 20,
    gap: 20,
  },
  avatarContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  avatarTitle: {
    fontSize: 28,
  },

  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 12,
  },

  buttonLogout: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    borderColor: "#E83F25",
    borderWidth: 1,
    paddingRight: 12,
    alignItems: "center",
  },
});
