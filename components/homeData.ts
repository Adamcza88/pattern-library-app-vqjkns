
/**
 * CANDLESTICK PATTERN MASTERY APP
 * 
 * A comprehensive learning app for mastering candlestick patterns through spaced repetition.
 * 
 * FEATURES IMPLEMENTED:
 * 
 * 1. Pattern Library (Home Screen)
 *    - Browse all candlestick patterns with visual cards
 *    - Mastery panel showing overall progress, streak, and daily goals
 *    - Filter chips: All, Learning, Mastered, Recent Mistakes, Confusable Pairs
 *    - Each pattern card shows: glyph, name, summary, difficulty badge, confirmation badge, mastery ring
 * 
 * 2. Pattern Detail Screen
 *    - Comprehensive breakdown: Meaning, Scenarios, Action Protocol, Real-World Context
 *    - Confusions section comparing similar patterns
 *    - Quick test with instant feedback
 *    - Action buttons to start Quiz or Practice
 * 
 * 3. Quiz Mode
 *    - Adaptive difficulty with graduated hints (3 levels)
 *    - Progress bar and score tracking
 *    - Unified feedback panel: Why correct/incorrect, How to recognize, Why other options are wrong
 *    - Spaced repetition integration (ready for backend)
 * 
 * 4. Practice Mode
 *    - 4 modes: Endless, Timed Challenge, Mistakes Only, Weak Set
 *    - Practice stats: Total practice, Accuracy, Time spent, Best streak
 *    - Shared feedback component with Quiz
 * 
 * 5. Profile Screen
 *    - User stats: Overall mastery, Streak, Mastered count, Learning count
 *    - Achievements system
 *    - Settings menu
 * 
 * DESIGN SYSTEM:
 * - Dark neo-futuristic theme with frosted glass effects
 * - Colors: Electric cyan primary, Vibrant purple secondary, Warm amber accent
 * - Typography: Inter (UI), JetBrains Mono (metrics/stats)
 * - Smooth animations with react-native-reanimated
 * - Gradient borders and glow effects
 * 
 * SPACED REPETITION:
 * - SM-2 inspired algorithm in utils/spacedRepetition.ts
 * - Tracks: ease, intervalDays, dueAt, correctCount, incorrectCount, recentMistakes
 * - Auto-promotes to "mastered" when criteria met
 * - Calculates problematic patterns for focused review
 * 
 * DATA STRUCTURE:
 * - types/pattern.ts: All TypeScript interfaces
 * - data/patterns.ts: 6 sample patterns (Hammer, Hanging Man, Doji, Bullish Engulfing, Morning Star, Shooting Star)
 * - data/mockMastery.ts: Mock user progress data
 * 
 * TODO: Backend Integration
 * - The app is ready for backend integration with TODO comments in the code
 * - Backend should provide: pattern data, user mastery tracking, quiz questions, spaced repetition sync
 * - API endpoints needed: GET /patterns, GET /mastery, POST /quiz-answer, GET /quiz-questions
 */

export const modalDemos = [
  {
    title: "Standard Modal",
    description: "Full screen modal presentation",
    route: "/modal",
    color: "#007AFF",
  },
  {
    title: "Form Sheet",
    description: "Bottom sheet with detents and grabber",
    route: "/formsheet",
    color: "#34C759",
  },
  {
    title: "Transparent Modal",
    description: "Overlay without obscuring background",
    route: "/transparent-modal",
    color: "#FF9500",
  }
];

export type ModalDemo = typeof modalDemos[0];
