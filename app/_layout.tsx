
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { SystemBars } from "react-native-edge-to-edge";
import { Stack, router } from "expo-router";
import { useNetworkState } from "expo-network";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, Alert } from "react-native";
import { colors } from "@/styles/commonStyles";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Custom dark theme matching our color scheme
const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.cardBorder,
    notification: colors.accent,
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const { isConnected } = useNetworkState();

  useEffect(() => {
    if (isConnected === false) {
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection and try again."
      );
    }
  }, [isConnected]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WidgetProvider>
        <ThemeProvider value={CustomDarkTheme}>
          <SystemBars style="light" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="formsheet"
              options={{
                presentation: "formSheet",
                sheetAllowedDetents: [0.5, 1],
                sheetLargestUndimmedDetent: 0.5,
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="transparent-modal"
              options={{
                presentation: "transparentModal",
                animation: "fade",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="pattern/[id]"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="quiz"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="practice"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </WidgetProvider>
    </GestureHandlerRootView>
  );
}
