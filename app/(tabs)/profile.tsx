
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@react-navigation/native";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { colors } from "@/styles/commonStyles";
import { mockMasteryData } from "@/data/mockMastery";
import { calculateOverallMastery, calculateStreak } from "@/utils/spacedRepetition";

export default function ProfileScreen() {
  const theme = useTheme();
  const overallMastery = calculateOverallMastery(mockMasteryData);
  const streak = calculateStreak(mockMasteryData);
  
  const masteredCount = mockMasteryData.filter(m => m.status === 'mastered').length;
  const learningCount = mockMasteryData.filter(m => m.status === 'learning').length;
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>TC</Text>
            </LinearGradient>
          </View>
          <Text style={styles.name}>Trading Champion</Text>
          <Text style={styles.subtitle}>Candlestick Pattern Master</Text>
        </View>
        
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.primary + '20', colors.primary + '10']}
              style={styles.statGradient}
            >
              <Text style={styles.statValue}>{overallMastery}%</Text>
              <Text style={styles.statLabel}>Overall Mastery</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.secondary + '20', colors.secondary + '10']}
              style={styles.statGradient}
            >
              <Text style={styles.statValue}>🔥 {streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.highlight + '20', colors.highlight + '10']}
              style={styles.statGradient}
            >
              <Text style={styles.statValue}>{masteredCount}</Text>
              <Text style={styles.statLabel}>Mastered</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.accent + '20', colors.accent + '10']}
              style={styles.statGradient}
            >
              <Text style={styles.statValue}>{learningCount}</Text>
              <Text style={styles.statLabel}>Learning</Text>
            </LinearGradient>
          </View>
        </View>
        
        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🎯</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>First Pattern Mastered</Text>
              <Text style={styles.achievementDescription}>
                Completed your first pattern with 100% accuracy
              </Text>
            </View>
          </View>
          
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🔥</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Week Warrior</Text>
              <Text style={styles.achievementDescription}>
                Maintained a 7-day learning streak
              </Text>
            </View>
          </View>
          
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>📚</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Pattern Scholar</Text>
              <Text style={styles.achievementDescription}>
                Studied all beginner patterns
              </Text>
            </View>
          </View>
        </View>
        
        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Settings</Text>
          
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <IconSymbol
              ios_icon_name="bell.fill"
              android_material_icon_name="notifications"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.settingText}>Notifications</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <IconSymbol
              ios_icon_name="chart.bar.fill"
              android_material_icon_name="bar-chart"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.settingText}>Learning Goals</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.settingText}>About</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.cardBorder,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Inter_800ExtraBold',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'JetBrainsMono_700Bold',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Inter_700Bold',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 8,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontFamily: 'Inter_400Regular',
  },
});
