
// Pattern data types
export interface CandlestickPattern {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  needsConfirmation: boolean;
  
  // Core content
  meaning: {
    summary: string;
    keyPoints: string[];
  };
  
  scenarios: {
    worksWell: string[];
    fails: string[];
    commonMistakes: string[];
  };
  
  actionProtocol: {
    trigger: string;
    confirmation: string;
    invalidation: string;
    risk: string;
  };
  
  realWorldContext: {
    location: string;
    trend: string;
    level: string;
    confirmation: string;
  };
  
  confusions?: {
    similarPattern: string;
    differences: string[];
  }[];
  
  quickTest?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  
  // Visual representation
  candleGlyph: string; // SVG path data or emoji representation
}

// User progress tracking
export interface PatternMastery {
  patternId: string;
  status: 'learning' | 'mastered';
  correctCount: number;
  incorrectCount: number;
  lastAttempt: Date;
  
  // Spaced repetition
  ease: number; // default 2.5
  intervalDays: number;
  dueAt: Date;
  
  // Recent performance
  recentMistakes: Date[];
}

// Quiz question
export interface QuizQuestion {
  id: string;
  patternId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  chartImage?: string; // URL or base64
  options: string[];
  correctIndex: number;
  explanation: string;
  hints: string[]; // Graduated hints
}

// Filter and mode types
export type BrowseMode = 'browse' | 'learn-path' | 'review';
export type FilterPreset = 'all' | 'learning' | 'mastered' | 'mistakes-7d' | 'confusable';
export type PracticeMode = 'endless' | 'timed' | 'mistakes' | 'weak-set';
