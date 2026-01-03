
import { PatternMastery } from '@/types/pattern';

// Spaced Repetition Algorithm (SM-2 inspired)
export const updateMastery = (
  mastery: PatternMastery,
  correct: boolean
): PatternMastery => {
  const now = new Date();
  const newMastery = { ...mastery };
  
  newMastery.lastAttempt = now;
  
  if (correct) {
    newMastery.correctCount += 1;
    newMastery.intervalDays = Math.round(newMastery.intervalDays * newMastery.ease);
    newMastery.ease = Math.min(newMastery.ease + 0.1, 3.0);
    
    // Promote to mastered if criteria met
    if (newMastery.correctCount >= 5 && newMastery.ease >= 2.5) {
      newMastery.status = 'mastered';
    }
  } else {
    newMastery.incorrectCount += 1;
    newMastery.intervalDays = 1;
    newMastery.ease = Math.max(newMastery.ease - 0.2, 1.3);
    newMastery.status = 'learning';
    
    // Track recent mistakes
    newMastery.recentMistakes = [
      ...newMastery.recentMistakes.slice(-4),
      now,
    ];
  }
  
  // Calculate next due date
  newMastery.dueAt = new Date(now.getTime() + newMastery.intervalDays * 24 * 60 * 60 * 1000);
  
  return newMastery;
};

// Calculate overall mastery percentage
export const calculateOverallMastery = (masteryData: PatternMastery[]): number => {
  if (masteryData.length === 0) return 0;
  
  const totalAttempts = masteryData.reduce(
    (sum, m) => sum + m.correctCount + m.incorrectCount,
    0
  );
  const totalCorrect = masteryData.reduce((sum, m) => sum + m.correctCount, 0);
  
  return totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
};

// Calculate current streak
export const calculateStreak = (masteryData: PatternMastery[]): number => {
  // Sort by last attempt date
  const sorted = [...masteryData].sort(
    (a, b) => b.lastAttempt.getTime() - a.lastAttempt.getTime()
  );
  
  let streak = 0;
  const oneDayMs = 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  for (const mastery of sorted) {
    const daysSinceAttempt = Math.floor((now - mastery.lastAttempt.getTime()) / oneDayMs);
    
    if (daysSinceAttempt <= 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Get top 5 problematic patterns
export const getProblematicPatterns = (
  masteryData: PatternMastery[]
): string[] => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  
  return masteryData
    .filter(m => {
      const recentMistakes = m.recentMistakes.filter(
        d => d.getTime() > sevenDaysAgo
      ).length;
      return recentMistakes > 0 || m.ease < 2.3;
    })
    .sort((a, b) => {
      const aScore = a.recentMistakes.length * 10 + (3.0 - a.ease);
      const bScore = b.recentMistakes.length * 10 + (3.0 - b.ease);
      return bScore - aScore;
    })
    .slice(0, 5)
    .map(m => m.patternId);
};

// Get patterns due for review
export const getDuePatterns = (masteryData: PatternMastery[]): string[] => {
  const now = Date.now();
  return masteryData
    .filter(m => m.dueAt.getTime() <= now)
    .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
    .map(m => m.patternId);
};
