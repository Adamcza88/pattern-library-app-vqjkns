
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { PracticeMode } from '@/types/pattern';
import { LinearGradient } from 'expo-linear-gradient';

export default function PracticeScreen() {
  const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(null);
  
  const practiceModes: { id: PracticeMode; title: string; description: string; icon: string }[] = [
    {
      id: 'endless',
      title: 'Endless Mode',
      description: 'Practice without time limits. Perfect for learning at your own pace.',
      icon: '∞',
    },
    {
      id: 'timed',
      title: 'Timed Challenge',
      description: '10 questions in 5 minutes. Test your speed and accuracy.',
      icon: '⏱️',
    },
    {
      id: 'mistakes',
      title: 'Mistakes Only',
      description: 'Focus on patterns you got wrong recently.',
      icon: '⚠️',
    },
    {
      id: 'weak-set',
      title: 'Weak Set',
      description: 'Practice patterns with low mastery scores.',
      icon: '📉',
    },
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Free Practice',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Practice Mode</Text>
          <Text style={styles.subtitle}>
            Select a mode that fits your learning style
          </Text>
        </View>
        
        <View style={styles.modesContainer}>
          {practiceModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeCard,
                selectedMode === mode.id && styles.modeCardSelected,
              ]}
              onPress={() => setSelectedMode(mode.id)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={
                  selectedMode === mode.id
                    ? [colors.primary + '20', colors.secondary + '20']
                    : ['transparent', 'transparent']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              
              <View style={styles.modeContent}>
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                <View style={styles.modeInfo}>
                  <Text style={styles.modeTitle}>{mode.title}</Text>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedMode && (
          <View style={styles.startContainer}>
            <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startGradient}
              >
                <Text style={styles.startButtonText}>Start Practice</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.startHint}>
              {selectedMode === 'endless' && 'Practice as long as you want'}
              {selectedMode === 'timed' && 'Get ready for a quick challenge'}
              {selectedMode === 'mistakes' && 'Learn from your mistakes'}
              {selectedMode === 'weak-set' && 'Strengthen your weak areas'}
            </Text>
          </View>
        )}
        
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Your Practice Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Total Practice</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>45m</Text>
              <Text style={styles.statLabel}>Time Spent</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Inter_800ExtraBold',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  modesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  modeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  modeCardSelected: {
    borderColor: colors.primary,
  },
  modeContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  modeIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  modeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  startContainer: {
    padding: 16,
    paddingTop: 24,
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  startGradient: {
    padding: 18,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Inter_700Bold',
  },
  startHint: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  statsSection: {
    padding: 16,
    paddingTop: 32,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Inter_700Bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
    fontFamily: 'JetBrainsMono_700Bold',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
});
