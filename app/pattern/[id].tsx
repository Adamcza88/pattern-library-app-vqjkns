
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { candlestickPatterns } from '@/data/patterns';
import { mockMasteryData } from '@/data/mockMastery';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';

export default function PatternDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  
  const pattern = candlestickPatterns.find(p => p.id === id);
  const mastery = mockMasteryData.find(m => m.patternId === id);
  
  if (!pattern) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Pattern Not Found' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Pattern not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const handleQuizAnswer = (index: number) => {
    setSelectedQuizAnswer(index);
    setShowQuizResult(true);
  };
  
  const masteryPercentage = mastery
    ? Math.round((mastery.correctCount / (mastery.correctCount + mastery.incorrectCount)) * 100)
    : 0;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: pattern.name,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={[colors.primary + '15', colors.secondary + '15']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.headerContent}>
            <Text style={styles.glyph}>{pattern.candleGlyph}</Text>
            <Text style={styles.patternName}>{pattern.name}</Text>
            
            {mastery && (
              <View style={styles.masteryBadge}>
                <Text style={styles.masteryText}>
                  {mastery.status === 'mastered' ? '✓ Mastered' : '📖 Learning'} • {masteryPercentage}%
                </Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Meaning Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 Meaning</Text>
          <View style={styles.card}>
            <Text style={styles.summaryText}>{pattern.meaning.summary}</Text>
            
            <View style={styles.keyPointsContainer}>
              {pattern.meaning.keyPoints.map((point, index) => (
                <View key={index} style={styles.keyPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.keyPointText}>{point}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        {/* Scenarios Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Scenarios</Text>
          
          <View style={styles.card}>
            <Text style={styles.subsectionTitle}>✅ Works Well</Text>
            {pattern.scenarios.worksWell.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listItemText}>{item}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.card}>
            <Text style={styles.subsectionTitle}>❌ Fails</Text>
            {pattern.scenarios.fails.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listItemText}>{item}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.card}>
            <Text style={styles.subsectionTitle}>⚠️ Common Mistakes</Text>
            {pattern.scenarios.commonMistakes.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listItemText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Action Protocol Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Action Protocol</Text>
          <View style={styles.card}>
            <View style={styles.protocolItem}>
              <Text style={styles.protocolLabel}>Trigger:</Text>
              <Text style={styles.protocolValue}>{pattern.actionProtocol.trigger}</Text>
            </View>
            
            <View style={styles.protocolItem}>
              <Text style={styles.protocolLabel}>Confirmation:</Text>
              <Text style={styles.protocolValue}>{pattern.actionProtocol.confirmation}</Text>
            </View>
            
            <View style={styles.protocolItem}>
              <Text style={styles.protocolLabel}>Invalidation:</Text>
              <Text style={styles.protocolValue}>{pattern.actionProtocol.invalidation}</Text>
            </View>
            
            <View style={styles.protocolItem}>
              <Text style={styles.protocolLabel}>Risk:</Text>
              <Text style={styles.protocolValue}>{pattern.actionProtocol.risk}</Text>
            </View>
          </View>
        </View>
        
        {/* Real-World Context Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌍 Real-World Context</Text>
          <View style={styles.card}>
            <View style={styles.contextGrid}>
              <View style={styles.contextItem}>
                <Text style={styles.contextLabel}>Location</Text>
                <Text style={styles.contextValue}>{pattern.realWorldContext.location}</Text>
              </View>
              
              <View style={styles.contextItem}>
                <Text style={styles.contextLabel}>Trend</Text>
                <Text style={styles.contextValue}>{pattern.realWorldContext.trend}</Text>
              </View>
              
              <View style={styles.contextItem}>
                <Text style={styles.contextLabel}>Level</Text>
                <Text style={styles.contextValue}>{pattern.realWorldContext.level}</Text>
              </View>
              
              <View style={styles.contextItem}>
                <Text style={styles.contextLabel}>Confirmation</Text>
                <Text style={styles.contextValue}>{pattern.realWorldContext.confirmation}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Confusions Section */}
        {pattern.confusions && pattern.confusions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔄 Common Confusions</Text>
            {pattern.confusions.map((confusion, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.confusionTitle}>
                  vs. {confusion.similarPattern}
                </Text>
                {confusion.differences.map((diff, diffIndex) => (
                  <View key={diffIndex} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listItemText}>{diff}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
        
        {/* Quick Test Section */}
        {pattern.quickTest && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎓 Quick Test</Text>
            <View style={styles.card}>
              <Text style={styles.questionText}>{pattern.quickTest.question}</Text>
              
              <View style={styles.optionsContainer}>
                {pattern.quickTest.options.map((option, index) => {
                  const isSelected = selectedQuizAnswer === index;
                  const isCorrect = index === pattern.quickTest!.correctIndex;
                  const showResult = showQuizResult && isSelected;
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        isSelected && styles.optionButtonSelected,
                        showResult && isCorrect && styles.optionButtonCorrect,
                        showResult && !isCorrect && styles.optionButtonIncorrect,
                      ]}
                      onPress={() => handleQuizAnswer(index)}
                      disabled={showQuizResult}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}>
                        {option}
                      </Text>
                      {showResult && isSelected && (
                        <Text style={styles.resultIcon}>
                          {isCorrect ? '✓' : '✗'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              {showQuizResult && (
                <View style={styles.explanationContainer}>
                  <Text style={styles.explanationTitle}>
                    {selectedQuizAnswer === pattern.quickTest.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
                  </Text>
                  <Text style={styles.explanationText}>
                    {pattern.quickTest.explanation}
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                      setSelectedQuizAnswer(null);
                      setShowQuizResult(false);
                    }}
                  >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.quizButton]}
            onPress={() => router.push('/quiz')}
          >
            <IconSymbol
              ios_icon_name="questionmark.circle.fill"
              android_material_icon_name="help"
              size={24}
              color={colors.text}
            />
            <Text style={styles.actionButtonText}>Take Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.practiceButton]}
            onPress={() => router.push('/practice')}
          >
            <IconSymbol
              ios_icon_name="play.circle.fill"
              android_material_icon_name="play-arrow"
              size={24}
              color={colors.text}
            />
            <Text style={styles.actionButtonText}>Practice</Text>
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
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  headerCard: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  headerContent: {
    padding: 24,
    alignItems: 'center',
  },
  glyph: {
    fontSize: 64,
    marginBottom: 12,
  },
  patternName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Inter_800ExtraBold',
  },
  masteryBadge: {
    backgroundColor: colors.primary + '20',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  masteryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Inter_700Bold',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
  },
  keyPointsContainer: {
    gap: 8,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
    marginTop: 2,
  },
  keyPointText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  protocolItem: {
    marginBottom: 12,
  },
  protocolLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  protocolValue: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  contextGrid: {
    gap: 16,
  },
  contextItem: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 12,
  },
  contextLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  contextValue: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
  },
  confusionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionButtonCorrect: {
    borderColor: colors.highlight,
    backgroundColor: colors.highlight + '10',
  },
  optionButtonIncorrect: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
  },
  optionTextSelected: {
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  resultIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  explanationContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Inter_700Bold',
  },
  explanationText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  quizButton: {
    backgroundColor: colors.secondary,
  },
  practiceButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
});
