import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import HomeIcon from "@/assets/icons/home-28.svg";
import DashboardIcon from "@/assets/icons/dashboard-28.svg";
import SettingIcon from "@/assets/icons/setting-28.svg";
import ReminderIcon from "@/assets/icons/reminder-28.svg";
import ProfileIcon from "@/assets/icons/profile-28.svg";
import HomeIconFocused from "@/assets/icons/home-focus-44.svg";
import DashboardIconFocused from "@/assets/icons/dashboard-focus-44.svg";
import ReminderIconFocused from "@/assets/icons/reminder-focus-44.svg";
import SettingIconFocused from "@/assets/icons/setting-focus-44.svg";
import ProfileIconFocused from "@/assets/icons/profile-focus-44.svg";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          opacity: 1,
          backgroundColor: "transparent",
        },
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
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <DashboardIconFocused width={44} height={44} color={color} />
            ) : (
              <DashboardIcon width={28} height={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="reminder"
        options={{
          title: "Reminder",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <ReminderIconFocused width={44} height={44} color={color} />
            ) : (
              <ReminderIcon width={28} height={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <HomeIconFocused width={44} height={44} color={color} />
            ) : (
              <HomeIcon width={28} height={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SettingIconFocused width={44} height={44} color={color} />
            ) : (
              <SettingIcon width={28} height={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <ProfileIconFocused width={44} height={44} color={color} />
            ) : (
              <ProfileIcon width={28} height={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
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
