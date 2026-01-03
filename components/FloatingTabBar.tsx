
import { useTheme } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { Href } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';

interface TabBarItem {
  route: Href;
  label: string;
  ios_icon_name: string;
  android_material_icon_name: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabBar: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary + '20',
    borderRadius: 12,
  },
});

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 32,
  borderRadius = 24,
  bottomMargin = 16,
}: FloatingTabBarProps) {
  const activeIndex = useSharedValue(0);
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(
            interpolate(activeIndex.value, [0, tabs.length - 1], [0, containerWidth - containerWidth / tabs.length]),
            { damping: 20, stiffness: 90 }
          ),
        },
      ],
      width: containerWidth / tabs.length,
    };
  });

  const handleTabPress = (route: Href, index: number) => {
    activeIndex.value = index;
    router.push(route);
  };

  React.useEffect(() => {
    const currentIndex = tabs.findIndex((tab) => pathname.includes(tab.route as string));
    if (currentIndex !== -1) {
      activeIndex.value = currentIndex;
    }
  }, [pathname, tabs, activeIndex]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <BlurView
        intensity={80}
        tint="dark"
        style={[
          styles.tabBar,
          {
            width: containerWidth,
            borderRadius,
            marginBottom: bottomMargin,
            backgroundColor: colors.card + 'CC',
          },
        ]}
      >
        <Animated.View style={[styles.activeIndicator, animatedStyle]} />
        {tabs.map((tab, index) => {
          const isActive = pathname.includes(tab.route as string);
          return (
            <TouchableOpacity
              key={tab.route as string}
              style={styles.tab}
              onPress={() => handleTabPress(tab.route, index)}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name={tab.ios_icon_name}
                android_material_icon_name={tab.android_material_icon_name}
                size={24}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? colors.primary : colors.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}
