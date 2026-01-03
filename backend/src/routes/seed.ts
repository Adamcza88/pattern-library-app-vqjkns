import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

interface PatternData {
  name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  meaning: string;
  keyRules: string[];
  needsConfirmation: boolean;
  scenarios: string[];
  actionProtocol: string;
  realWorldContext: string;
  confusions?: string[];
  candleSvgData?: string;
  quickTest?: {
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
  };
  exampleCharts?: Array<{
    type: "correct" | "incorrect" | "borderline";
    image: string;
    description: string;
  }>;
}

const CANDLESTICK_PATTERNS: PatternData[] = [
  {
    name: "Hammer",
    difficulty: "beginner",
    category: "bullish",
    meaning:
      "A hammer is a bullish reversal pattern that appears after a downtrend. It shows strong buying pressure at lower prices.",
    keyRules: [
      "Small real body at the top",
      "Long lower wick (2-3x body size)",
      "Little or no upper wick",
      "Appears after a downtrend",
    ],
    needsConfirmation: true,
    scenarios: [
      "Stock trading near lows",
      "Strong rejection of lower prices",
      "Buyer accumulation signal",
    ],
    actionProtocol:
      "Wait for confirmation (close above the body). Buy on the next candle if confirmed. Place stop loss below the hammer's low.",
    realWorldContext:
      "Often signals a potential reversal when support is found. Commonly seen at market bottoms.",
    confusions: ["Hanging man looks similar but is bearish"],
    quickTest: {
      question: "What distinguishes a Hammer from a Hanging Man?",
      options: [
        "The location in the trend (hammer after downtrend, hanging man after uptrend)",
        "The size of the real body",
        "The length of the upper wick",
        "The color of the candle",
      ],
      correctOptionIndex: 0,
      explanation:
        "The key difference is where they appear: Hammers form after a downtrend and are bullish, while Hanging Men form after an uptrend and are bearish.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Hammer+Pattern",
        description:
          "Clear hammer with small body, long lower wick, forming after downtrend",
      },
      {
        type: "incorrect",
        image:
          "https://via.placeholder.com/400x300?text=Not+a+Hammer",
        description:
          "Large upper wick makes this less reliable as a hammer signal",
      },
    ],
  },
  {
    name: "Hanging Man",
    difficulty: "beginner",
    category: "bearish",
    meaning:
      "A hanging man is a bearish reversal pattern that appears after an uptrend. It signals potential weakness despite the higher close.",
    keyRules: [
      "Small real body at the top",
      "Long lower wick (2-3x body size)",
      "Little or no upper wick",
      "Appears after an uptrend",
    ],
    needsConfirmation: true,
    scenarios: ["Stock near highs", "Potential reversal signal", "Selling pressure below"],
    actionProtocol:
      "Wait for confirmation with a bearish candle. Short on confirmation or take profits on long positions. Place stop loss above the pattern.",
    realWorldContext: "Signals potential exhaustion of uptrend. Look for confirmation before acting.",
    confusions: ["Hammer looks identical but appears in downtrend"],
    quickTest: {
      question: "What makes a Hanging Man bearish despite its similar appearance to a Hammer?",
      options: [
        "Its position after an uptrend",
        "The color of the candle",
        "The length of the wicks",
        "The volume on that day",
      ],
      correctOptionIndex: 0,
      explanation:
        "Context is crucial: the same pattern is bullish after a downtrend (Hammer) and bearish after an uptrend (Hanging Man).",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Hanging+Man",
        description:
          "Hanging man with small body and long lower wick appearing after sustained uptrend",
      },
    ],
  },
  {
    name: "Shooting Star",
    difficulty: "beginner",
    category: "bearish",
    meaning:
      "The shooting star is a bearish reversal pattern with a small real body at the bottom and a long upper wick, indicating rejection of higher prices.",
    keyRules: [
      "Small real body at the bottom",
      "Long upper wick (at least 2x body height)",
      "Little or no lower wick",
      "Appears after an uptrend",
    ],
    needsConfirmation: true,
    scenarios: ["Price rejection at highs", "Seller dominance", "Weakening momentum"],
    actionProtocol:
      "Confirm with a bearish candle closing below the body. Place short stop loss above the upper wick.",
    realWorldContext:
      "Shows sellers are in control. Upper wick represents buyers being overwhelmed by sellers.",
    confusions: ["Inverted hammer is the opposite pattern"],
    quickTest: {
      question: "What does the long upper wick on a Shooting Star represent?",
      options: [
        "Buyers pushing prices higher",
        "Strong closing momentum",
        "Rejection of higher prices by sellers",
        "Strong support level",
      ],
      correctOptionIndex: 2,
      explanation:
        "The long upper wick shows that buyers tried to push prices higher but were rejected, with sellers taking control by the close.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Shooting+Star",
        description:
          "Classic shooting star with small lower body and prominent upper wick after uptrend",
      },
    ],
  },
  {
    name: "Inverted Hammer",
    difficulty: "beginner",
    category: "bullish",
    meaning:
      "The inverted hammer is a bullish reversal pattern with a small real body at the bottom and a long upper wick, appearing after a downtrend.",
    keyRules: [
      "Small real body at the bottom",
      "Long upper wick (at least 2x body height)",
      "Little or no lower wick",
      "Appears after a downtrend",
    ],
    needsConfirmation: true,
    scenarios: ["Price recovery attempt", "Buyer interest", "Support validation"],
    actionProtocol:
      "Look for confirmation with a bullish candle. Buy on confirmation above the pattern high.",
    realWorldContext:
      "Suggests potential reversal. Upper wick shows buying interest testing higher prices.",
    confusions: ["Shooting star is similar but bearish"],
    quickTest: {
      question: "How does Inverted Hammer differ from Shooting Star?",
      options: [
        "Inverted Hammer appears after downtrend, Shooting Star after uptrend",
        "Inverted Hammer has no upper wick",
        "Shooting Star has a green body",
        "They are the same pattern",
      ],
      correctOptionIndex: 0,
      explanation:
        "The context of where the pattern appears determines its significance: Inverted Hammer is bullish when found at a bottom, Shooting Star is bearish when found at a top.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Inverted+Hammer",
        description: "Inverted hammer with small body at bottom and long upper wick after downtrend",
      },
    ],
  },
  {
    name: "Doji",
    difficulty: "beginner",
    category: "neutral",
    meaning:
      "A doji is a single candlestick with virtually no real body, where open and close are virtually equal. It indicates indecision in the market.",
    keyRules: [
      "Open and close prices nearly equal",
      "Small or no real body",
      "Upper and lower wicks present",
      "Can have various wick lengths",
    ],
    needsConfirmation: true,
    scenarios: [
      "Market indecision",
      "Potential reversal point",
      "Support/resistance testing",
    ],
    actionProtocol:
      "Doji alone is neutral. Look for confirmation on next candle. Use with other technical indicators.",
    realWorldContext:
      "Represents a tug of war between buyers and sellers. Most important when at support/resistance levels.",
    confusions: ["Many variations exist: dragonfly, gravestone, long-legged"],
    quickTest: {
      question: "What does a Doji candlestick primarily indicate?",
      options: [
        "Strong uptrend continuation",
        "Strong downtrend continuation",
        "Market indecision between buyers and sellers",
        "Definite reversal signal",
      ],
      correctOptionIndex: 2,
      explanation:
        "A Doji's small or absent real body shows that buyers and sellers were equally matched, neither side winning conclusively.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Doji",
        description: "Classic doji with nearly equal open and close, showing market indecision",
      },
    ],
  },
  {
    name: "Dragonfly Doji",
    difficulty: "intermediate",
    category: "bullish",
    meaning:
      "A dragonfly doji has a long lower wick with open and close at or near the high, showing strong buying pressure after sellers tested lower prices.",
    keyRules: [
      "Long lower wick",
      "Open and close near the high",
      "Little or no upper wick",
      "No real body or tiny real body",
    ],
    needsConfirmation: true,
    scenarios: [
      "Buyers defending lower prices",
      "Reversal from downtrend",
      "Support found",
    ],
    actionProtocol:
      "Confirm with bullish candle. Buy on confirmation. Stop loss below the lower wick.",
    realWorldContext:
      "Strong signal when appearing at support levels. Shows buyers overwhelming sellers.",
    confusions: ["Differs from regular Doji by having wicks concentrated at bottom"],
    quickTest: {
      question: "What is the bullish significance of the long lower wick in a Dragonfly Doji?",
      options: [
        "It shows sellers are in control",
        "It indicates buyers stepped in and defended lower prices",
        "It suggests weakness continuing",
        "It means nothing without confirmation",
      ],
      correctOptionIndex: 1,
      explanation:
        "The long lower wick shows prices were pushed down, but buyers stepped in aggressively to push back up to near the open, indicating strong buying pressure.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Dragonfly+Doji",
        description: "Dragonfly doji with long lower wick and open/close at top",
      },
    ],
  },
  {
    name: "Gravestone Doji",
    difficulty: "intermediate",
    category: "bearish",
    meaning:
      "A gravestone doji has a long upper wick with open and close at or near the low, showing rejection of higher prices.",
    keyRules: [
      "Long upper wick",
      "Open and close near the low",
      "Little or no lower wick",
      "No real body or tiny real body",
    ],
    needsConfirmation: true,
    scenarios: ["Sellers reject higher prices", "Reversal from uptrend", "Resistance rejected"],
    actionProtocol:
      "Confirm with bearish candle. Short on confirmation. Stop loss above upper wick.",
    realWorldContext:
      "Powerful bearish signal at resistance. Shows buyers gave up attempting higher prices.",
    confusions: ["Distinguished from regular Doji by concentrated upper wick"],
    quickTest: {
      question: "What market behavior does a Gravestone Doji's long upper wick represent?",
      options: [
        "Buyers pushing strongly higher",
        "Strong support being held",
        "Sellers rejecting higher prices that buyers attempted",
        "Equilibrium between buyers and sellers",
      ],
      correctOptionIndex: 2,
      explanation:
        "The long upper wick shows buyers tried to push prices higher, but sellers dominated, closing the candle back down near the open, showing rejection of higher prices.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Gravestone+Doji",
        description: "Gravestone doji with long upper wick and open/close near low",
      },
    ],
  },
  {
    name: "Bullish Engulfing",
    difficulty: "intermediate",
    category: "bullish",
    meaning:
      "A bullish engulfing pattern occurs when a large green candle completely contains the previous red candle's range, indicating reversal momentum.",
    keyRules: [
      "First candle is red (bearish)",
      "Second candle is green (bullish)",
      "Second candle's body completely contains first candle's body",
      "Appears after a downtrend",
    ],
    needsConfirmation: false,
    scenarios: [
      "Trend reversal",
      "Buyer momentum shift",
      "Support testing",
      "Potential bottom",
    ],
    actionProtocol:
      "Strong signal with no confirmation needed. Buy on the open of next candle. Place stop loss at the low of the pattern.",
    realWorldContext:
      "Shows shift from sellers to buyers. Strong reversal signal, especially in downtrends or at support.",
    confusions: ["Bearish engulfing is the opposite pattern"],
    quickTest: {
      question:
        "Why is a Bullish Engulfing pattern considered a stronger signal than a single reversal candle?",
      options: [
        "Because it has two candles instead of one",
        "It shows a shift in momentum from sellers (red) to buyers (green)",
        "It requires confirmation",
        "All candlestick patterns are equally reliable",
      ],
      correctOptionIndex: 1,
      explanation:
        "The pattern shows the market changing direction over two candles: first sellers control the day (red), then buyers take over and push past sellers' opening price (green), showing a true momentum shift.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Bullish+Engulfing",
        description: "Green candle completely engulfing previous red candle",
      },
      {
        type: "incorrect",
        image:
          "https://via.placeholder.com/400x300?text=Partial+Engulf",
        description:
          "Green candle that doesn't fully contain the previous candle is weaker",
      },
    ],
  },
  {
    name: "Bearish Engulfing",
    difficulty: "intermediate",
    category: "bearish",
    meaning:
      "A bearish engulfing pattern occurs when a large red candle completely contains the previous green candle's range, indicating reversal momentum downward.",
    keyRules: [
      "First candle is green (bullish)",
      "Second candle is red (bearish)",
      "Second candle's body completely contains first candle's body",
      "Appears after an uptrend",
    ],
    needsConfirmation: false,
    scenarios: ["Trend reversal", "Seller momentum shift", "Resistance rejection", "Potential top"],
    actionProtocol:
      "Strong signal with no confirmation needed. Short on the open of next candle. Place stop loss at the high of the pattern.",
    realWorldContext:
      "Shows shift from buyers to sellers. Powerful reversal signal, especially at market tops or resistance.",
    confusions: ["Bullish engulfing is the opposite pattern"],
    quickTest: {
      question:
        "When is a Bearish Engulfing pattern most significant in terms of its trading implications?",
      options: [
        "When it appears after a short downtrend",
        "When it appears after a prolonged uptrend at potential resistance",
        "When the red candle is very dark",
        "They are all equally significant",
      ],
      correctOptionIndex: 1,
      explanation:
        "Context matters greatly. A Bearish Engulfing after a prolonged uptrend has more significance because it's reversing a strong trend and occurs at a potential top.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Bearish+Engulfing",
        description: "Red candle completely engulfing previous green candle",
      },
    ],
  },
  {
    name: "Morning Star",
    difficulty: "advanced",
    category: "bullish",
    meaning:
      "A three-candle bullish reversal pattern showing a downtrend ending. Pattern consists of: large red candle, small candle with gap down, and large green candle.",
    keyRules: [
      "First candle is red, confirming downtrend",
      "Second candle gaps down with small body (indecision)",
      "Third candle is green, opening above second candle's open",
      "Third candle closes into first candle's red body",
    ],
    needsConfirmation: false,
    scenarios: ["Strong reversal signal", "End of downtrend", "Major bottom formation"],
    actionProtocol:
      "Reliable without confirmation. Buy after the third candle closes. Stop loss below the second candle low.",
    realWorldContext:
      "One of the most reliable reversal patterns. Second candle shows indecision at bottom, third shows strength.",
    confusions: ["Evening star is the bearish version"],
    quickTest: {
      question:
        "Why is the small second candle important in the Morning Star pattern's formation?",
      options: [
        "It proves buyers will win",
        "It shows market indecision at the bottom, creating the potential for reversal",
        "It represents the sellers' last stand",
        "It determines the price target",
      ],
      correctOptionIndex: 1,
      explanation:
        "The small body on the second candle shows neither buyers nor sellers are in control, creating indecision. This indecision at the bottom of a downtrend sets up the potential for reversal.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Morning+Star",
        description:
          "Complete morning star: large red, small body with gap down, large green pushing into red body",
      },
    ],
  },
  {
    name: "Evening Star",
    difficulty: "advanced",
    category: "bearish",
    meaning:
      "A three-candle bearish reversal pattern showing an uptrend ending. Pattern consists of: large green candle, small candle with gap up, and large red candle.",
    keyRules: [
      "First candle is green, confirming uptrend",
      "Second candle gaps up with small body (indecision)",
      "Third candle is red, opening below second candle's open",
      "Third candle closes into first candle's green body",
    ],
    needsConfirmation: false,
    scenarios: ["Strong reversal signal", "End of uptrend", "Major top formation"],
    actionProtocol:
      "Reliable without confirmation. Short after the third candle closes. Stop loss above the second candle high.",
    realWorldContext:
      "Powerful bearish reversal. Gap up on second candle shows potential exhaustion, confirmed by third candle rejection.",
    confusions: ["Morning star is the bullish version"],
    quickTest: {
      question: "What does the gap on the second candle of an Evening Star indicate?",
      options: [
        "Buyers are still in strong control",
        "A sign of weakness despite the gap up",
        "Increased bullish momentum",
        "An unmissable buying opportunity",
      ],
      correctOptionIndex: 1,
      explanation:
        "The gap up might seem bullish, but the small candle shows indecision at highs. When the third candle comes down and closes into the first candle, it confirms that the uptrend is over and reversal is likely.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Evening+Star",
        description:
          "Complete evening star: large green, small body with gap up, large red pushing into green body",
      },
    ],
  },
  {
    name: "Three White Soldiers",
    difficulty: "advanced",
    category: "bullish",
    meaning:
      "Three consecutive green candles with each opening within the previous candle's body and closing near their highs, showing strong bullish momentum.",
    keyRules: [
      "Three consecutive green candles",
      "Each opens within or near the previous candle's body",
      "Each closes near its high",
      "Each candle is larger than the previous (ideally)",
      "No long upper wicks",
    ],
    needsConfirmation: false,
    scenarios: ["Strong uptrend formation", "Sustained buying pressure", "Breakout confirmation"],
    actionProtocol:
      "Buy on pattern completion or during its formation. Very bullish signal. Trail stops as price rises.",
    realWorldContext:
      "Represents three days of solid buying. Shows consistent buyer control. Pattern is stronger when appearing at support.",
    confusions: ["Three black crows is the bearish equivalent"],
    quickTest: {
      question: "What makes the 'Three White Soldiers' pattern more reliable than a single green candle?",
      options: [
        "It has three candles",
        "It demonstrates sustained buying pressure over three periods, not just one",
        "It's guaranteed to continue up",
        "It always appears at exact support levels",
      ],
      correctOptionIndex: 1,
      explanation:
        "Three consecutive green candles prove that buyers are consistently in control across multiple time periods, which is stronger than a single bullish candle.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Three+White+Soldiers",
        description: "Three green candles each opening in previous body and closing near highs",
      },
      {
        type: "borderline",
        image:
          "https://via.placeholder.com/400x300?text=Weak+Soldiers",
        description:
          "Three green candles but with long upper wicks, less reliable due to rejection at highs",
      },
    ],
  },
  {
    name: "Three Black Crows",
    difficulty: "advanced",
    category: "bearish",
    meaning:
      "Three consecutive red candles with each opening within the previous candle's body and closing near their lows, showing strong bearish momentum.",
    keyRules: [
      "Three consecutive red candles",
      "Each opens within or near the previous candle's body",
      "Each closes near its low",
      "Each candle is larger than the previous (ideally)",
      "No long lower wicks",
    ],
    needsConfirmation: false,
    scenarios: ["Strong downtrend formation", "Sustained selling pressure", "Breakdown confirmation"],
    actionProtocol:
      "Short on pattern completion or during formation. Very bearish signal. Trail stops as price falls.",
    realWorldContext:
      "Represents three days of consistent selling. Shows seller control is sustained. Pattern is stronger when appearing at resistance.",
    confusions: ["Three white soldiers is the bullish equivalent"],
    quickTest: {
      question: "Why is the pattern called 'Three Black Crows' and what does it suggest?",
      options: [
        "It's a random name with no meaning",
        "Three red candles that perch like crows, suggesting continued downward movement",
        "It only works on Fridays",
        "It's a single candle pattern misnamed",
      ],
      correctOptionIndex: 1,
      explanation:
        "The poetic name suggests three red candles 'perching' one after another, each closing near its low, suggesting continued downward movement and sustained selling.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Three+Black+Crows",
        description: "Three red candles each opening in previous body and closing near lows",
      },
    ],
  },
  {
    name: "Tweezer Top",
    difficulty: "intermediate",
    category: "bearish",
    meaning:
      "Two candles with virtually identical highs, forming a resistance level where price failed to break through, suggesting a bearish reversal.",
    keyRules: [
      "Two candles (can be any color)",
      "Highs are almost identical (within a few pips)",
      "Appears after an uptrend",
      "Preferably at a resistance level",
    ],
    needsConfirmation: true,
    scenarios: ["Resistance rejection", "Double top formation", "Reversal signal", "Supply zone"],
    actionProtocol:
      "Confirm with a bearish candle closing below the pattern. Short below the pattern lows.",
    realWorldContext:
      "Shows buyers twice tried to push through same level but failed. Indicates resistance that may reverse trend.",
    confusions: ["Tweezer bottom is the bullish version"],
    quickTest: {
      question: "What does identical highs on two candles suggest about the market?",
      options: [
        "Buyers are very strong",
        "Price exactly equals resistance where both buyers and sellers meet",
        "The pattern is useless",
        "Volume must be high",
      ],
      correctOptionIndex: 1,
      explanation:
        "Identical highs suggest both candles met the same resistance level and failed to break through, indicating that level is important resistance.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Tweezer+Top",
        description: "Two candles with nearly identical highs after uptrend",
      },
    ],
  },
  {
    name: "Tweezer Bottom",
    difficulty: "intermediate",
    category: "bullish",
    meaning:
      "Two candles with virtually identical lows, forming a support level where price bounced up, suggesting a bullish reversal.",
    keyRules: [
      "Two candles (can be any color)",
      "Lows are almost identical (within a few pips)",
      "Appears after a downtrend",
      "Preferably at a support level",
    ],
    needsConfirmation: true,
    scenarios: ["Support bounce", "Double bottom formation", "Reversal signal", "Demand zone"],
    actionProtocol:
      "Confirm with a bullish candle closing above the pattern. Buy above the pattern highs.",
    realWorldContext:
      "Shows sellers twice tried to push through same level but buyers defended. Indicates important support.",
    confusions: ["Tweezer top is the bearish version"],
    quickTest: {
      question: "How does a Tweezer Bottom pattern function as a support level?",
      options: [
        "It predicts prices will never go higher",
        "It shows buyers defended the same level twice, establishing it as support",
        "It's just a visual coincidence",
        "It requires 5 candles to be confirmed",
      ],
      correctOptionIndex: 1,
      explanation:
        "When two candles reach the same low and bounce back up, it shows that buyers are willing to buy at that level twice, establishing it as meaningful support.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Tweezer+Bottom",
        description: "Two candles with nearly identical lows after downtrend",
      },
    ],
  },
  {
    name: "Piercing Line",
    difficulty: "intermediate",
    category: "bullish",
    meaning:
      "A two-candle bullish reversal pattern where a green candle opens below the previous red candle's low and closes above its midpoint.",
    keyRules: [
      "First candle is red (bearish)",
      "Second candle is green (bullish)",
      "Second candle opens below first candle's low (gap down)",
      "Second candle closes above the midpoint of first candle's body",
    ],
    needsConfirmation: false,
    scenarios: ["Downtrend reversal", "Support finding", "Buyer aggression"],
    actionProtocol:
      "Buy when second candle closes above midpoint. Stop loss below the second candle's low.",
    realWorldContext:
      "Shows sellers had control (red candle), but next day buyers attacked aggressively below first candle's low and pushed price back above midpoint.",
    confusions: ["Dark cloud cover is similar but bearish"],
    quickTest: {
      question: "Why is the Piercing Line's aggressive action bullish?",
      options: [
        "Because the second candle is green",
        "Because buyers opened below the low and pushed back above midpoint, showing they won't give up",
        "Because it has a gap",
        "Because it always leads to new highs",
      ],
      correctOptionIndex: 1,
      explanation:
        "The key is that buyers didn't just open higher; they opened LOWER (showing strength) and still pushed price back above the first candle's midpoint, demonstrating powerful buying pressure.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Piercing+Line",
        description: "Green candle opening below previous red low and closing above its midpoint",
      },
    ],
  },
  {
    name: "Dark Cloud Cover",
    difficulty: "intermediate",
    category: "bearish",
    meaning:
      "A two-candle bearish reversal pattern where a red candle opens above the previous green candle's high and closes below its midpoint.",
    keyRules: [
      "First candle is green (bullish)",
      "Second candle is red (bearish)",
      "Second candle opens above first candle's high (gap up)",
      "Second candle closes below the midpoint of first candle's body",
    ],
    needsConfirmation: false,
    scenarios: ["Uptrend reversal", "Resistance rejection", "Seller aggression"],
    actionProtocol:
      "Short when second candle closes below midpoint. Stop loss above the second candle's high.",
    realWorldContext:
      "Shows buyers had control but next day sellers attacked from above and pushed price back below green candle's midpoint.",
    confusions: ["Piercing line is similar but bullish"],
    quickTest: {
      question: "What market behavior does the Dark Cloud Cover pattern represent?",
      options: [
        "Continued bullish strength",
        "A minor pullback in an uptrend",
        "A shift from buyer control (green) to seller dominance (red below midpoint)",
        "An opportunity to buy dips",
      ],
      correctOptionIndex: 2,
      explanation:
        "The pattern shows sellers taking over from buyers: they open above the previous high and push price down below the midpoint, showing a shift in control from buyers to sellers.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Dark+Cloud+Cover",
        description: "Red candle opening above previous green high and closing below its midpoint",
      },
    ],
  },
  {
    name: "Harami",
    difficulty: "intermediate",
    category: "neutral",
    meaning:
      "A small candle completely contained within the body of the previous larger candle, indicating indecision and potential reversal.",
    keyRules: [
      "First candle is large",
      "Second candle is small with opposite or same color",
      "Second candle is completely within first candle's body",
      "No overlap of wicks is required",
    ],
    needsConfirmation: true,
    scenarios: ["Potential reversal", "Indecision", "Trend exhaustion"],
    actionProtocol:
      "Confirm with a candle in direction of expected reversal. Best used with support/resistance levels.",
    realWorldContext:
      "Shows the market lost momentum. The small candle inside the large one suggests a change in dynamics.",
    confusions: ["Engulfing pattern is opposite structure"],
    quickTest: {
      question: "What is the key characteristic that defines a Harami pattern?",
      options: [
        "Three candles in a row",
        "A small candle completely contained within a larger candle's body",
        "A gap between candles",
        "Two candles of equal size",
      ],
      correctOptionIndex: 1,
      explanation:
        "The defining characteristic is that the second candle is completely inside the first candle's body, showing a loss of momentum from the previous day.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Harami",
        description:
          "Small candle completely contained within the body of previous larger candle",
      },
    ],
  },
  {
    name: "Rickshaw Man",
    difficulty: "advanced",
    category: "neutral",
    meaning:
      "A single candle with long upper and lower wicks and a small real body, indicating strong indecision and potential reversal.",
    keyRules: [
      "Long upper wick",
      "Long lower wick",
      "Small real body in the middle",
      "Upper and lower wicks roughly similar length",
    ],
    needsConfirmation: true,
    scenarios: [
      "Market indecision",
      "Potential reversal point",
      "Support/resistance testing",
    ],
    actionProtocol:
      "Confirm direction with next candle. Trade breaks of the upper or lower wick.",
    realWorldContext:
      "Shows both buyers and sellers were strong but neither won. Represents equilibrium being tested.",
    confusions: ["Doji has similar indecision but no real body"],
    quickTest: {
      question: "What makes the Rickshaw Man different from a Doji?",
      options: [
        "A Doji has a completely absent real body while Rickshaw Man has a small one",
        "They are the same pattern",
        "Rickshaw Man only appears on Fridays",
        "A Rickshaw Man must have equal wicks",
      ],
      correctOptionIndex: 0,
      explanation:
        "While both indicate indecision, the key difference is that a Doji has virtually no real body (open equals close), while a Rickshaw Man has a small but visible real body.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Rickshaw+Man",
        description:
          "Candle with long upper and lower wicks and small real body in the middle",
      },
    ],
  },
  {
    name: "Kicking Pattern",
    difficulty: "advanced",
    category: "bullish",
    meaning:
      "Two candles with a gap between them, first candle bearish and second bullish, showing a powerful shift in momentum.",
    keyRules: [
      "First candle is red (bearish)",
      "Second candle is green (bullish)",
      "Gap exists between candles (no overlap)",
      "Large difference in direction between candles",
    ],
    needsConfirmation: false,
    scenarios: [
      "Strong momentum shift",
      "Gap breakout",
      "Major reversal",
      "News-driven reversals",
    ],
    actionProtocol:
      "Buy on the second candle or on any pullback. Strong trend continuation likely.",
    realWorldContext:
      "Gap shows big shift in sentiment. Often follows news or economic events that change market direction.",
    confusions: ["Multiple gap patterns exist with different implications"],
    quickTest: {
      question:
        "What does the gap between the two candles in a Kicking Pattern specifically indicate?",
      options: [
        "The gap is unimportant",
        "A significant change in sentiment between two periods, usually due to news or events",
        "Price will always fill the gap",
        "Buyers and sellers agreed on pricing",
      ],
      correctOptionIndex: 1,
      explanation:
        "The gap shows there was no price discovery between the close of the red candle and the open of the green candle, indicating a significant event or sentiment change occurred.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Kicking+Pattern",
        description: "Red candle followed by gap and green candle showing momentum shift",
      },
    ],
  },
  {
    name: "Marubozu",
    difficulty: "intermediate",
    category: "neutral",
    meaning:
      "A candle with no wicks, where the open is the low and close is the high (bullish) or open is high and close is low (bearish), showing strong direction.",
    keyRules: [
      "No upper wick",
      "No lower wick",
      "Large real body",
      "Green (bullish) or red (bearish)",
    ],
    needsConfirmation: false,
    scenarios: [
      "Strong directional movement",
      "Trend continuation",
      "Buyer or seller dominance",
    ],
    actionProtocol:
      "For bullish: buy at open or on pullback. For bearish: short at open. No wicks suggest no hesitation.",
    realWorldContext:
      "No wicks mean no rejection of prices. Entire period was dominated by one side, showing strong conviction.",
    confusions: ["Differs from other patterns by complete lack of wicks"],
    quickTest: {
      question: "What does the absence of wicks on a Marubozu candle indicate?",
      options: [
        "The pattern is incomplete",
        "No hesitation from either buyers or sellers - one side controlled the entire period",
        "The candle is broken",
        "Volume was low",
      ],
      correctOptionIndex: 1,
      explanation:
        "Wicks represent attempts to move in the opposite direction that were rejected. No wicks means there were no such attempts - one side controlled the entire period with no resistance.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Marubozu",
        description: "Green or red candle with no upper or lower wicks",
      },
    ],
  },
  {
    name: "Counterattack Line",
    difficulty: "advanced",
    category: "neutral",
    meaning:
      "A pattern where two consecutive candles have the same closing price despite opposite colors, indicating potential reversal.",
    keyRules: [
      "First candle is one color (red or green)",
      "Second candle is opposite color",
      "Both close at virtually same price level",
      "Shows stalemate between buyers and sellers",
    ],
    needsConfirmation: true,
    scenarios: ["Potential reversal", "Support/resistance bounce", "Indecision"],
    actionProtocol:
      "Confirm with third candle. If bullish reversal: buy on confirmation. If bearish: short on confirmation.",
    realWorldContext:
      "Same closing price despite opposite colors shows power shifted but neither side won. Third candle determines outcome.",
    confusions: ["Requires confirmation to be reliable"],
    quickTest: {
      question: "Why is the identical closing price in a Counterattack Line significant?",
      options: [
        "It's just a coincidence",
        "It shows both sides fought hard but neither won, requiring confirmation for direction",
        "It guarantees continuation in one direction",
        "It's always a buy signal",
      ],
      correctOptionIndex: 1,
      explanation:
        "The same close despite opposite colors shows the market is balanced and undecided. This creates an opportunity for the next candle to break the tie and reveal direction.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Counterattack+Line",
        description:
          "Two candles of opposite colors closing at virtually the same price level",
      },
    ],
  },
  {
    name: "Unique Three Line Strike",
    difficulty: "advanced",
    category: "bullish",
    meaning:
      "Four candles forming a reversal pattern: three red candles showing downtrend, then a green candle that opens below all three and closes above all three.",
    keyRules: [
      "Three red candles showing downtrend",
      "Each red candle closes lower than previous",
      "Fourth candle is green",
      "Green candle opens below third red candle's low",
      "Green candle closes above first red candle's open or high",
    ],
    needsConfirmation: false,
    scenarios: ["Strong reversal", "Exhaustion of sellers", "Bottom formation"],
    actionProtocol:
      "Buy on the fourth candle. This is a reliable reversal pattern. Stop loss below the green candle's low.",
    realWorldContext:
      "Three days of selling sets up sellers for exhaustion. Fourth candle shows buyers taking over completely.",
    confusions: ["Requires strict adherence to candle sequence"],
    quickTest: {
      question:
        "What must the green candle in a Unique Three Line Strike accomplish to complete the pattern?",
      options: [
        "Simply close green",
        "Open lower and close higher than all three previous red candles, showing complete reversal",
        "Have a long upper wick",
        "Be larger than the red candles",
      ],
      correctOptionIndex: 1,
      explanation:
        "The green candle must open below all three red candles (showing it started at the bottom) and close above them all, showing complete reversal and seller exhaustion.",
    },
    exampleCharts: [
      {
        type: "correct",
        image:
          "https://via.placeholder.com/400x300?text=Three+Line+Strike",
        description:
          "Three red candles closing progressively lower, then green candle opening below all and closing above all",
      },
    ],
  },
];

export function register(app: App, fastify: FastifyInstance) {
  // POST /seed - Populate database with candlestick patterns
  fastify.post(
    "/seed",
    {
      schema: {
        description: "Seed database with candlestick patterns (development only)",
        tags: ["admin"],
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              count: { type: "integer" },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // Check if patterns already exist
      const existingPatterns = await app.db.select().from(schema.patterns).limit(1);

      if (existingPatterns.length > 0) {
        return {
          success: true,
          message: "Database already seeded",
          count: 0,
        };
      }

      // Insert all patterns
      const insertedPatterns = await app.db
        .insert(schema.patterns)
        .values(
          CANDLESTICK_PATTERNS.map((pattern) => {
            const insertData: any = {
              name: pattern.name,
              difficulty: pattern.difficulty,
              category: pattern.category,
              meaning: pattern.meaning,
              keyRules: pattern.keyRules,
              needsConfirmation: pattern.needsConfirmation,
              scenarios: pattern.scenarios,
              actionProtocol: pattern.actionProtocol,
              realWorldContext: pattern.realWorldContext,
            };

            if (pattern.confusions !== undefined) {
              insertData.confusions = pattern.confusions;
            }
            if (pattern.candleSvgData !== undefined) {
              insertData.candleSvgData = pattern.candleSvgData;
            }
            if (pattern.quickTest !== undefined) {
              insertData.quickTest = pattern.quickTest;
            }
            if (pattern.exampleCharts !== undefined) {
              insertData.exampleCharts = pattern.exampleCharts;
            }

            return insertData;
          })
        )
        .returning();

      return {
        success: true,
        count: insertedPatterns.length,
        message: `Successfully seeded database with ${insertedPatterns.length} candlestick patterns`,
      };
    }
  );
}
