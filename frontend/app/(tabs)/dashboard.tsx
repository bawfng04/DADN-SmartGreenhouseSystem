import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Calendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiCall } from "@/utils/apiCall";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
const screenWidth = Dimensions.get("window").width;

interface Dashboard {
  temperature: { value: number; label: string }[];
  humidity: { value: number; label: string }[];
  soil_moisture: { value: number; label: string }[];
  light: { value: number; label: string }[];
}

type Data = {
  label: string;
  value: number;
};

const testData: Data[] = [
  { label: "8", value: 20 },
  { label: "9", value: 20 },
  { label: "12", value: 23 },
  { label: "15", value: 25 },
  { label: "18", value: 27 },
  { label: "20", value: 28 },
  { label: "23", value: 30 },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [openCalendar, setOpenCalendar] = useState(false);
  const [type, setType] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(selectedDate);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [dataTemp, setDataTemp] = useState<Data[]>([]);
  const [dataHumidity, setDataHumidity] = useState<Data[]>([]);
  const [dataSoilMoisture, setDataSoilMoisture] = useState<Data[]>([]);
  const [dataLight, setDataLight] = useState<Data[]>([]);

  const { data, isSuccess } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await apiCall({
        endpoint: `/dashboard/${selectedDate.toISOString().split("T")[0]}`, //YYYY-MM-DD
      });
      const newData = replaceNullData(response);
      return newData;
    },
    enabled: isAuthenticated,
  });

  const { data: updateData, mutate: updateDashboard } = useMutation({
    mutationFn: async () => {
      const response = await apiCall({
        endpoint: `/dashboard/${selectedDate.toISOString().split("T")[0]}`, //YYYY-MM-DD
      });
      const data = replaceNullData(response);
      console.log("response from API:", data);
      return data;
    },
    onSuccess: (data) => {
      console.log("update dashboard response from API:", data);
      queryClient.setQueryData(["dashboard"], data);
    },
  });

  useEffect(() => {
    if (data) {
      setDataTemp(data.temperature);
      setDataHumidity(data.humidity);
      setDataSoilMoisture(data.soil_moisture);
      setDataLight(data.light);
    }
  }, [data]);

  useEffect(() => {
    if (updateData) {
      console.log("updateData", updateData);
      setDataTemp(updateData.temperature);
      setDataHumidity(updateData.humidity);
      setDataSoilMoisture(updateData.soil_moisture);
      setDataLight(updateData.light);
    }
  }, [updateData]);

  console.log("dataTemp", dataTemp);
  console.log("testData", testData);

  const chartConfig = {
    curved: true,
    areaChart: true,
    animateOnDataChange: true,
    animationDuration: 1000,
    onDataChangeAnimationDuration: 1000,
    isAnimated: true,
    hideDataPoints: true,
    startOpacity: 0.8,
    endOpacity: 0.3,
    xAxisLabelTextStyle: { fontSize: 12 },
    thickness: 3,
    initialSpacing: 1,
    endSpacing: 0,
    yAxisLabelWidth: 30,
    yAxisTextStyle: { fontSize: 12 },
    yAxisOffset: 0,
    noOfSections: 3,
    hideRules: true,
    maxValue: 50,
    width: screenWidth - 96,
    adjustToWidth: true,
    height: 100,
  };

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 100,
      }}
    >
      <ScrollView style={styles.scrollView} scrollEnabled={!openCalendar}>
        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <TouchableOpacity onPress={() => setOpenCalendar(!openCalendar)}>
              <Image source={require("@/assets/images/Calendar.png")} />
            </TouchableOpacity>
            <Text style={styles.date}>
              {selectedDate.toISOString().split("T")[0]}
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Nhiệt độ</Text>
            <Text style={styles.unit}>°C</Text>
          </View>
          <LineChart
            data={dataTemp.length ? dataTemp : testData}
            {...chartConfig}
            color="#FF0000"
            startFillColor="rgba(255, 0, 0, 0.7)"
            endFillColor="rgba(255, 240, 240, 0.43)"
          />
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Độ ẩm không khí</Text>
            <Text style={styles.unit}>%</Text>
          </View>
          <LineChart
            data={dataHumidity.length ? dataHumidity : testData}
            {...chartConfig}
            color="#008CFF"
            startFillColor="rgba(19, 0, 224, 0.7)"
            endFillColor="rgba(255, 240, 240, 0.43)"
          />
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Độ ẩm đất</Text>
            <Text style={styles.unit}>%</Text>
          </View>
          <LineChart
            data={dataSoilMoisture.length ? dataSoilMoisture : testData}
            {...chartConfig}
            color="#00DA16"
            startFillColor="rgba(0, 229, 34, 0.7)"
            endFillColor="rgba(255, 240, 240, 0.43)"
          />
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Cường độ ánh sáng</Text>
            <Text style={styles.unit}>lux</Text>
          </View>
          <LineChart
            data={dataLight.length ? dataLight : testData}
            {...chartConfig}
            color="#FFCC00"
            startFillColor="rgba(229, 199, 0, 0.7)"
            endFillColor="rgba(255, 240, 240, 0.43)"
          />
        </View>
      </ScrollView>
      {openCalendar && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => {
              setOpenCalendar(false);
              setTempDate(selectedDate);
            }}
          />
          <View style={styles.calendarContainer}>
            <Calendar
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: "#FF9500",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#FF9500",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
              }}
              markedDates={{
                [tempDate.toISOString().split("T")[0]]: { selected: true },
              }}
              maxDate={new Date().toISOString().split("T")[0]}
              onDayPress={(day: { timestamp: number }) => {
                setTempDate(new Date(day.timestamp));
              }}
              disableAllTouchEventsForDisabledDays={true}
            />
            <View style={styles.calendarButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setOpenCalendar(false);
                  setTempDate(selectedDate);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setSelectedDate(tempDate);
                  setOpenCalendar(false);
                  updateDashboard();
                }}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecffe1",
  },
  scrollView: {
    paddingHorizontal: 20,
    gap: 1000,
    flex: 1,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  viewSelector: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewSelectorText: {
    color: "#fff",
    fontWeight: "600",
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 16,
    height: 200,
    width: "100%",
    gap: 16,
    paddingHorizontal: 8,
  },
  chartHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    // marginBottom: 8,
    // marginLeft: 16,
  },
  unit: {
    fontSize: 14,
  },

  chart: {
    marginVertical: 8,
    borderColor: "red",
    borderWidth: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    width: "90%",
    position: "absolute",
    top: "30%",
    left: "5%",
    zIndex: 1001,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  cancelButton: {
    backgroundColor: "#D9D9D9",
    padding: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#FF9500",
    padding: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

const replaceNullData = (data: any) => {
  const filled: any = {};
  for (const key in data) {
    if (Array.isArray(data[key])) {
      filled[key] = data[key].map((item: any) => ({
        ...item,
        value: item.value ?? 0,
      }));
    } else {
      filled[key] = data[key];
    }
  }
  return filled;
};
