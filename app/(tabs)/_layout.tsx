
import React from "react";
import FloatingTabBar from "@/components/FloatingTabBar";
import { Stack } from "expo-router";

export default function TabLayout() {
  const tabs = [
    {
      route: "/(tabs)/(home)" as const,
      label: "Patterns",
      ios_icon_name: "book.fill",
      android_material_icon_name: "menu-book",
    },
    {
      route: "/(tabs)/profile" as const,
      label: "Profile",
      ios_icon_name: "person.fill",
      android_material_icon_name: "person",
    },
  ];

  return (
    <React.Fragment>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </React.Fragment>
  );
}
