
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { PatternMastery } from '@/types/pattern';
import { calculateOverallMastery, calculateStreak, getProblematicPatterns } from '@/utils/spacedRepetition';
import { LinearGradient } from 'expo-linear-gradient';

interface MasteryPanelProps {
  masteryData: PatternMastery[];
  onProblematicPress: (patternIds: string[]) => void;
}

export const MasteryPanel: React.FC<MasteryPanelProps> = ({ masteryData, onProblematicPress }) => {
  const overallMastery = calculateOverallMastery(masteryData);
  const streak = calculateStreak(masteryData);
  const problematicPatterns = getProblematicPatterns(masteryData);
  
  const todayGoal = 10; // Could be configurable
  const todayProgress = masteryData.filter(m => {
    const today = new Date().toDateString();
    return m.lastAttempt.toDateString() === today;
  }).length;
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '15', colors.secondary + '15']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{overallMastery}%</Text>
            <Text style={styles.statLabel}>Overall Mastery</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🔥 {streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayProgress}/{todayGoal}</Text>
            <Text style={styles.statLabel}>Today&apos;s Goal</Text>
          </View>
        </View>
        
        {/* Problematic Patterns */}
        {problematicPatterns.length > 0 && (
          <TouchableOpacity
            style={styles.problematicButton}
            onPress={() => onProblematicPress(problematicPatterns)}
            activeOpacity={0.7}
          >
            <Text style={styles.problematicText}>
              ⚠️ {problematicPatterns.length} patterns need attention
            </Text>
            <Text style={styles.problematicSubtext}>Tap to focus on weak areas</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
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
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.cardBorder,
  },
  problematicButton: {
    backgroundColor: colors.warning + '20',
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  problematicText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: 2,
    fontFamily: 'Inter_600SemiBold',
  },
  problematicSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
});
