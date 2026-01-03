
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { candlestickPatterns } from '@/data/patterns';
import { LinearGradient } from 'expo-linear-gradient';

export default function QuizScreen() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  
  // Get patterns with quick tests
  const quizPatterns = candlestickPatterns.filter(p => p.quickTest);
  const currentPattern = quizPatterns[currentQuestionIndex];
  const currentQuestion = currentPattern?.quickTest;
  
  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Quiz' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No quiz questions available</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const hints = [
    'Think about the trend context',
    'Consider the candle body and shadows',
    'Remember the confirmation requirements',
  ];
  
  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === currentQuestion.correctIndex) {
      setScore(score + 1);
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quizPatterns.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setHintLevel(0);
    } else {
      // Quiz complete
      router.back();
    }
  };
  
  const handleHint = () => {
    if (hintLevel < hints.length) {
      setHintLevel(hintLevel + 1);
    }
  };
  
  const progress = ((currentQuestionIndex + 1) / quizPatterns.length) * 100;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Quiz Mode',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {quizPatterns.length}
          </Text>
        </View>
        
        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}/{quizPatterns.length}</Text>
        </View>
        
        {/* Pattern Info */}
        <View style={styles.patternCard}>
          <LinearGradient
            colors={[colors.secondary + '20', colors.primary + '20']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.patternGlyph}>{currentPattern.candleGlyph}</Text>
          <Text style={styles.patternName}>{currentPattern.name}</Text>
        </View>
        
        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>
        
        {/* Hints */}
        {hintLevel > 0 && (
          <View style={styles.hintsContainer}>
            {hints.slice(0, hintLevel).map((hint, index) => (
              <View key={index} style={styles.hintCard}>
                <Text style={styles.hintLabel}>💡 Hint {index + 1}:</Text>
                <Text style={styles.hintText}>{hint}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctIndex;
            const showFeedback = showResult && isSelected;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                  showFeedback && isCorrect && styles.optionButtonCorrect,
                  showFeedback && !isCorrect && styles.optionButtonIncorrect,
                ]}
                onPress={() => handleAnswer(index)}
                disabled={showResult}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option}
                </Text>
                {showFeedback && (
                  <Text style={styles.resultIcon}>{isCorrect ? '✓' : '✗'}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Feedback Panel */}
        {showResult && (
          <View style={styles.feedbackPanel}>
            <LinearGradient
              colors={
                selectedAnswer === currentQuestion.correctIndex
                  ? [colors.highlight + '20', colors.highlight + '10']
                  : [colors.error + '20', colors.error + '10']
              }
              style={styles.feedbackGradient}
            >
              <Text style={styles.feedbackTitle}>
                {selectedAnswer === currentQuestion.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
              </Text>
              
              <View style={styles.feedbackSection}>
                <Text style={styles.feedbackLabel}>Why:</Text>
                <Text style={styles.feedbackText}>{currentQuestion.explanation}</Text>
              </View>
              
              <View style={styles.feedbackSection}>
                <Text style={styles.feedbackLabel}>How to recognize:</Text>
                <Text style={styles.feedbackText}>{currentPattern.meaning.summary}</Text>
              </View>
              
              {selectedAnswer !== currentQuestion.correctIndex && (
                <View style={styles.feedbackSection}>
                  <Text style={styles.feedbackLabel}>Why other options are wrong:</Text>
                  <Text style={styles.feedbackText}>
                    The correct answer is: {currentQuestion.options[currentQuestion.correctIndex]}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!showResult && hintLevel < hints.length && (
            <TouchableOpacity style={styles.hintButton} onPress={handleHint}>
              <Text style={styles.hintButtonText}>💡 Show Hint ({hintLevel + 1}/{hints.length})</Text>
            </TouchableOpacity>
          )}
          
          {showResult && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex < quizPatterns.length - 1 ? 'Next Question →' : 'Finish Quiz'}
              </Text>
            </TouchableOpacity>
          )}
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
  progressContainer: {
    padding: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'JetBrainsMono_700Bold',
  },
  patternCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    overflow: 'hidden',
  },
  patternGlyph: {
    fontSize: 48,
    marginBottom: 8,
  },
  patternName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Inter_700Bold',
  },
  questionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 26,
    fontFamily: 'Inter_600SemiBold',
  },
  hintsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  hintCard: {
    padding: 12,
    backgroundColor: colors.accent + '15',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  hintLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  hintText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
  },
  optionsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  optionButton: {
    backgroundColor: colors.card,
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
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
  },
  optionTextSelected: {
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  resultIcon: {
    fontSize: 24,
    marginLeft: 8,
  },
  feedbackPanel: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  feedbackGradient: {
    padding: 20,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Inter_700Bold',
  },
  feedbackSection: {
    marginBottom: 12,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  feedbackText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  hintButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  hintButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
});
