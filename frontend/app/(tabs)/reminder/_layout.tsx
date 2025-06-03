import { Stack } from "expo-router";

export default function ReminderLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="setting_reminder" />
    </Stack>
  );
}
