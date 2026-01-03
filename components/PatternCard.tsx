
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { CandlestickPattern } from '@/types/pattern';
import { PatternMastery } from '@/types/pattern';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PatternCardProps {
  pattern: CandlestickPattern;
  mastery?: PatternMastery;
  onPress: () => void;
}

export const PatternCard: React.FC<PatternCardProps> = ({ pattern, mastery, onPress }) => {
  const masteryPercentage = mastery
    ? Math.round((mastery.correctCount / (mastery.correctCount + mastery.incorrectCount)) * 100)
    : 0;
  
  const difficultyColor = {
    beginner: colors.highlight,
    intermediate: colors.accent,
    advanced: colors.secondary,
  }[pattern.difficulty];
  
  return (
    <Animated.View entering={FadeIn}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.card}>
          <LinearGradient
            colors={['rgba(0, 212, 255, 0.05)', 'rgba(124, 58, 237, 0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.cardContent}>
            {/* Candle Glyph */}
            <View style={styles.glyphContainer}>
              <Text style={styles.glyph}>{pattern.candleGlyph}</Text>
              {mastery && (
                <View style={[styles.masteryRing, { borderColor: mastery.status === 'mastered' ? colors.highlight : colors.accent }]}>
                  <Text style={styles.masteryText}>{masteryPercentage}%</Text>
                </View>
              )}
            </View>
            
            {/* Pattern Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.patternName}>{pattern.name}</Text>
              <Text style={styles.summary} numberOfLines={2}>
                {pattern.meaning.summary}
              </Text>
              
              {/* Badges */}
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, { backgroundColor: difficultyColor + '20', borderColor: difficultyColor }]}>
                  <Text style={[styles.badgeText, { color: difficultyColor }]}>
                    {pattern.difficulty}
                  </Text>
                </View>
                
                {pattern.needsConfirmation && (
                  <View style={[styles.badge, { backgroundColor: colors.warning + '20', borderColor: colors.warning }]}>
                    <Text style={[styles.badgeText, { color: colors.warning }]}>
                      Needs Confirmation
                    </Text>
                  </View>
                )}
                
                {mastery?.status === 'mastered' && (
                  <View style={[styles.badge, { backgroundColor: colors.highlight + '20', borderColor: colors.highlight }]}>
                    <Text style={[styles.badgeText, { color: colors.highlight }]}>
                      ✓ Mastered
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 212, 255, 0.2)',
      },
    }),
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  glyphContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  glyph: {
    fontSize: 48,
  },
  masteryRing: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  masteryText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'JetBrainsMono_700Bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  patternName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  summary: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
});
