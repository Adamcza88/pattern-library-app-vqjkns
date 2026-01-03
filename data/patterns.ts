
import { CandlestickPattern } from '@/types/pattern';

export const candlestickPatterns: CandlestickPattern[] = [
  {
    id: 'hammer',
    name: 'Hammer',
    difficulty: 'beginner',
    needsConfirmation: true,
    candleGlyph: '🔨',
    
    meaning: {
      summary: 'A bullish reversal pattern that forms at the bottom of a downtrend.',
      keyPoints: [
        'Small body at the top of the range',
        'Long lower shadow (2-3x body length)',
        'Little to no upper shadow',
      ],
    },
    
    scenarios: {
      worksWell: [
        'At support levels after extended downtrend',
        'With high volume on formation day',
        'When followed by bullish confirmation candle',
      ],
      fails: [
        'In middle of strong downtrend without support',
        'On low volume',
        'Without follow-through confirmation',
      ],
      commonMistakes: [
        'Trading without waiting for confirmation',
        'Confusing with Hanging Man in uptrend',
        'Ignoring overall market context',
      ],
    },
    
    actionProtocol: {
      trigger: 'Hammer forms at support level',
      confirmation: 'Next candle closes above hammer high',
      invalidation: 'Price breaks below hammer low',
      risk: 'Place stop loss below hammer low',
    },
    
    realWorldContext: {
      location: 'Bottom of downtrend, at support',
      trend: 'Downtrend reversing to uptrend',
      level: 'Support zone',
      confirmation: 'Bullish candle or gap up',
    },
    
    confusions: [
      {
        similarPattern: 'Hanging Man',
        differences: [
          'Hammer appears in downtrend (bullish)',
          'Hanging Man appears in uptrend (bearish)',
          'Same shape, different context',
        ],
      },
    ],
    
    quickTest: {
      question: 'Where should a Hammer pattern appear to be valid?',
      options: [
        'At the top of an uptrend',
        'At the bottom of a downtrend',
        'In the middle of a range',
        'Only on daily charts',
      ],
      correctIndex: 1,
      explanation: 'A Hammer is a bullish reversal pattern that must form at the bottom of a downtrend to be valid.',
    },
  },
  
  {
    id: 'hanging-man',
    name: 'Hanging Man',
    difficulty: 'beginner',
    needsConfirmation: true,
    candleGlyph: '🪢',
    
    meaning: {
      summary: 'A bearish reversal pattern that forms at the top of an uptrend.',
      keyPoints: [
        'Small body at the top of the range',
        'Long lower shadow (2-3x body length)',
        'Appears after uptrend',
      ],
    },
    
    scenarios: {
      worksWell: [
        'At resistance levels after extended uptrend',
        'With high volume',
        'When followed by bearish confirmation',
      ],
      fails: [
        'In middle of strong uptrend',
        'On low volume',
        'Without bearish follow-through',
      ],
      commonMistakes: [
        'Confusing with Hammer in downtrend',
        'Trading without confirmation',
        'Ignoring resistance levels',
      ],
    },
    
    actionProtocol: {
      trigger: 'Hanging Man forms at resistance',
      confirmation: 'Next candle closes below Hanging Man low',
      invalidation: 'Price breaks above Hanging Man high',
      risk: 'Place stop loss above Hanging Man high',
    },
    
    realWorldContext: {
      location: 'Top of uptrend, at resistance',
      trend: 'Uptrend reversing to downtrend',
      level: 'Resistance zone',
      confirmation: 'Bearish candle or gap down',
    },
    
    confusions: [
      {
        similarPattern: 'Hammer',
        differences: [
          'Hanging Man appears in uptrend (bearish)',
          'Hammer appears in downtrend (bullish)',
          'Context determines the meaning',
        ],
      },
    ],
    
    quickTest: {
      question: 'What makes a Hanging Man bearish?',
      options: [
        'Its long lower shadow',
        'Its position at the top of an uptrend',
        'Its small body',
        'Its color (red or green)',
      ],
      correctIndex: 1,
      explanation: 'The Hanging Man is bearish because it appears at the top of an uptrend, signaling potential reversal.',
    },
  },
  
  {
    id: 'doji',
    name: 'Doji',
    difficulty: 'beginner',
    needsConfirmation: true,
    candleGlyph: '✝️',
    
    meaning: {
      summary: 'A neutral pattern indicating indecision in the market.',
      keyPoints: [
        'Open and close are virtually equal',
        'Can have long or short shadows',
        'Signals potential reversal or continuation',
      ],
    },
    
    scenarios: {
      worksWell: [
        'At major support or resistance',
        'After extended trends',
        'With high volume',
      ],
      fails: [
        'In ranging markets',
        'On low volume',
        'Without clear trend context',
      ],
      commonMistakes: [
        'Trading Doji without context',
        'Assuming all Dojis are reversal signals',
        'Ignoring the trend direction',
      ],
    },
    
    actionProtocol: {
      trigger: 'Doji forms at key level',
      confirmation: 'Next candle shows directional move',
      invalidation: 'Price continues in original direction',
      risk: 'Wait for confirmation before entry',
    },
    
    realWorldContext: {
      location: 'Support, resistance, or trend extremes',
      trend: 'Indecision - potential reversal',
      level: 'Key technical levels',
      confirmation: 'Strong directional candle',
    },
    
    quickTest: {
      question: 'What does a Doji indicate?',
      options: [
        'Strong bullish momentum',
        'Strong bearish momentum',
        'Market indecision',
        'Trend continuation',
      ],
      correctIndex: 2,
      explanation: 'A Doji indicates market indecision, as buyers and sellers are in equilibrium.',
    },
  },
  
  {
    id: 'engulfing-bullish',
    name: 'Bullish Engulfing',
    difficulty: 'intermediate',
    needsConfirmation: true,
    candleGlyph: '📈',
    
    meaning: {
      summary: 'A two-candle bullish reversal pattern where the second candle engulfs the first.',
      keyPoints: [
        'First candle is bearish (red)',
        'Second candle is bullish (green) and larger',
        'Second candle opens below first close, closes above first open',
      ],
    },
    
    scenarios: {
      worksWell: [
        'At support after downtrend',
        'With increasing volume on second candle',
        'Near key support levels',
      ],
      fails: [
        'In strong downtrends without support',
        'On decreasing volume',
        'Without follow-through',
      ],
      commonMistakes: [
        'Trading partial engulfing patterns',
        'Ignoring volume confirmation',
        'Not waiting for close of engulfing candle',
      ],
    },
    
    actionProtocol: {
      trigger: 'Bullish engulfing completes at support',
      confirmation: 'Volume increases on engulfing candle',
      invalidation: 'Price breaks below engulfing low',
      risk: 'Stop loss below engulfing candle low',
    },
    
    realWorldContext: {
      location: 'Bottom of downtrend, support zones',
      trend: 'Downtrend to uptrend reversal',
      level: 'Support',
      confirmation: 'High volume, continued buying',
    },
    
    confusions: [
      {
        similarPattern: 'Bearish Engulfing',
        differences: [
          'Bullish engulfing is green over red',
          'Bearish engulfing is red over green',
          'Opposite trend contexts',
        ],
      },
    ],
    
    quickTest: {
      question: 'What must the second candle do in a Bullish Engulfing pattern?',
      options: [
        'Touch the first candle',
        'Completely engulf the first candle body',
        'Be the same size as the first',
        'Have a long upper shadow',
      ],
      correctIndex: 1,
      explanation: 'The second candle must completely engulf the body of the first candle for a valid Bullish Engulfing pattern.',
    },
  },
  
  {
    id: 'morning-star',
    name: 'Morning Star',
    difficulty: 'advanced',
    needsConfirmation: true,
    candleGlyph: '⭐',
    
    meaning: {
      summary: 'A three-candle bullish reversal pattern signaling the end of a downtrend.',
      keyPoints: [
        'First candle: Large bearish candle',
        'Second candle: Small body (star) - gaps down',
        'Third candle: Large bullish candle - closes above midpoint of first',
      ],
    },
    
    scenarios: {
      worksWell: [
        'At major support levels',
        'After extended downtrends',
        'With volume increase on third candle',
      ],
      fails: [
        'In shallow corrections',
        'Without clear support',
        'On low volume',
      ],
      commonMistakes: [
        'Not waiting for third candle confirmation',
        'Trading without gap in second candle',
        'Ignoring volume patterns',
      ],
    },
    
    actionProtocol: {
      trigger: 'Morning Star completes at support',
      confirmation: 'Third candle closes above first candle midpoint',
      invalidation: 'Price breaks below pattern low',
      risk: 'Stop below second candle (star) low',
    },
    
    realWorldContext: {
      location: 'Major support, downtrend bottom',
      trend: 'Strong downtrend reversal',
      level: 'Key support zone',
      confirmation: 'Volume surge on third candle',
    },
    
    confusions: [
      {
        similarPattern: 'Evening Star',
        differences: [
          'Morning Star is bullish (bottom)',
          'Evening Star is bearish (top)',
          'Mirror patterns in opposite contexts',
        ],
      },
    ],
    
    quickTest: {
      question: 'How many candles form a Morning Star pattern?',
      options: [
        'One candle',
        'Two candles',
        'Three candles',
        'Four candles',
      ],
      correctIndex: 2,
      explanation: 'A Morning Star is a three-candle pattern: bearish, small star, and bullish candle.',
    },
  },
  
  {
    id: 'shooting-star',
    name: 'Shooting Star',
    difficulty: 'intermediate',
    needsConfirmation: true,
    candleGlyph: '💫',
    
    meaning: {
      summary: 'A bearish reversal pattern with a small body and long upper shadow.',
      keyPoints: [
        'Small body at bottom of range',
        'Long upper shadow (2-3x body)',
        'Little to no lower shadow',
      ],
    },
    
    scenarios: {
      worksWell: [
        'At resistance after uptrend',
        'With high volume',
        'When followed by bearish confirmation',
      ],
      fails: [
        'In middle of uptrend',
        'On low volume',
        'Without bearish follow-through',
      ],
      commonMistakes: [
        'Trading without confirmation',
        'Confusing with Inverted Hammer',
        'Ignoring resistance levels',
      ],
    },
    
    actionProtocol: {
      trigger: 'Shooting Star at resistance',
      confirmation: 'Next candle closes below Shooting Star low',
      invalidation: 'Price breaks above Shooting Star high',
      risk: 'Stop above Shooting Star high',
    },
    
    realWorldContext: {
      location: 'Top of uptrend, resistance',
      trend: 'Uptrend to downtrend reversal',
      level: 'Resistance zone',
      confirmation: 'Bearish candle follows',
    },
    
    confusions: [
      {
        similarPattern: 'Inverted Hammer',
        differences: [
          'Shooting Star is bearish (top of uptrend)',
          'Inverted Hammer is bullish (bottom of downtrend)',
          'Same shape, different context',
        ],
      },
    ],
    
    quickTest: {
      question: 'Where should a Shooting Star appear?',
      options: [
        'At the bottom of a downtrend',
        'At the top of an uptrend',
        'In a sideways market',
        'Anywhere in the chart',
      ],
      correctIndex: 1,
      explanation: 'A Shooting Star is a bearish reversal pattern that appears at the top of an uptrend.',
    },
  },
];
