import React, { useState, useEffect, useRef, useCallback } from "react";
import SettingsIcon from "@/assets/icons/setting-fill-22.svg";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiCall } from "@/utils/apiCall";
import reminderMockData from "@/data/reminders.mock.json";
import AddNewButton from "@/assets/images/addButton.svg";
import { SwipeListView } from "react-native-swipe-list-view";
import RemoveButton from "@/assets/images/Remove.svg";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const unit = {
  temperature: "°C",
  soil_moisture: "%",
  humidity: "%",
  light: "lux",
};

const name = {
  temperature: "Nhiệt độ",
  soil_moisture: "Độ ẩm đất",
  humidity: "Độ ẩm không khí",
  light: "Cường độ ánh sáng",
};

const icon = {
  temperature: require("@/assets/images/Temperature.png"),
  soil_moisture: require("@/assets/images/SoilMoisture.png"),
  humidity: require("@/assets/images/Humidity.png"),
  light: require("@/assets/images/Sunlight.png"),
};

interface ReminderType {
  id: string;
  index: string;
  higherThan: number;
  lowerThan: number;
  repeatAfter: number;
  active?: boolean;
}
const CardReminder: React.FC<ReminderType> = ({
  id,
  index,
  higherThan,
  lowerThan,
  repeatAfter,
  active,
}) => {
  const [updateStatus, setUpdateStatus] = useState(active);

  const toggleSwitch = () => {
    setUpdateStatus((prev) => !prev);
    saveSettingsMutation.mutate();
  };

  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      return apiCall({
        endpoint: `/reminders/${id}/status`,
        method: "PATCH",
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
        <Image source={icon[index as keyof typeof icon]} style={styles.icon} />
        <View style={styles.info}>
          <Text style={styles.name}>{name[index as keyof typeof name]}</Text>
          <View style={styles.displayRow}>
            {higherThan && (
              <Text style={styles.label}>
                {higherThan
                  ? "Cao hơn " +
                    higherThan +
                    " " +
                    unit[index as keyof typeof unit]
                  : ""}
              </Text>
            )}
            {lowerThan && (
              <Text style={styles.label}>
                {lowerThan
                  ? "Thấp hơn " +
                    lowerThan +
                    " " +
                    unit[index as keyof typeof unit]
                  : ""}
              </Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.ControlSection}>
        <Switch
          value={updateStatus}
          onValueChange={toggleSwitch}
          trackColor={{ false: "#ccc", true: "#ffa500" }}
          thumbColor="#fff"
        />
      </View>
    </View>
  );
};

export default function ReminderTab() {
  const insets = useSafeAreaInsets();
  const [reminderList, setReminderList] = useState<ReminderType[]>([]);
  const router = useRouter();
  const listViewRef = useRef<any>(null);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  useFocusEffect(
    useCallback(() => {
      listViewRef.current?.closeAllOpenRows?.();
      refetch();
    }, [])
  );

  const handleDelete = useMutation({
    mutationFn: async (id: string) => {
      console.log("handleDelete ~ id:", id);
      return apiCall({ endpoint: `/reminders/${id}`, method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
    onError: (error) => {
      console.error("Error deleting reminder:", error);
    },
  });

  const {
    data: reminders,
    isSuccess,
    isLoading,
    refetch,
  } = useQuery<any>({
    queryKey: ["reminders"],
    queryFn: async () => {
      const response = await apiCall({ endpoint: `/reminders` });
      console.log(" ~ queryFn: ~ response:", response);
      return response;
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (reminders) {
      console.log("reminders", reminders);
      setReminderList(reminders);
    }
  }, [reminders]);

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 20,
      }}
    >
      {isLoading || reminderList.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Image source={require("@/assets/images/empty-state.png")} />
          <Text style={{ fontSize: 28 }}>Chưa có lời nhắc nào</Text>
        </View>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => {
            // This will close any swiped open row
            listViewRef.current?.closeAllOpenRows?.();
          }}
        >
          <View style={styles.scrollWrapper}>
            <SwipeListView
              ref={listViewRef}
              data={reminderList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <CardReminder {...item} />}
              renderHiddenItem={({ item }) => (
                <View style={styles.rowBack}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete.mutate(item.id)}
                  >
                    <RemoveButton width={44} height={44} />
                  </TouchableOpacity>
                </View>
              )}
              rightOpenValue={-75}
              disableRightSwipe
              contentContainerStyle={styles.reminderList}
            />
          </View>
        </TouchableWithoutFeedback>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          router.push({
            pathname: "/reminder/setting_reminder",
          } as const)
        }
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Thêm</Text>
        <AddNewButton width={48} height={48} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecffe1",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  scrollWrapper: {
    height: "80%",
    width: "100%",
  },
  reminderList: {
    gap: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",
    elevation: 4,
    height: 112,
    width: "100%",
    gap: 12,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    marginTop: 4,
  },
  info: {
    flexDirection: "column",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  displayRow: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  ControlSection: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  label: {
    fontSize: 16,
  },
  LeftSection: {
    gap: 12,
    flexDirection: "row",
  },
  iconButton: {
    padding: 4,
    borderRadius: 8,
    elevation: 100,
    shadowColor: "#000",
    shadowOffset: { width: 12, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 56,
    width: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  rowBack: {
    alignItems: "center",
    // backgroundColor: "black",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    borderRadius: 20,
    width: "100%",
    height: 112,
  },
  deleteButton: {
    backgroundColor: "#E83F25",
    width: 65,
    height: 112,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderRadius: 20,
  },
});
