import { ICandle } from "../candle";
import { CandleImpact, CandleType, FuturePotential, PatternType } from "../candle/constants";

export interface PatternResult {
    impact: CandleImpact;
}

export const CORE_PATTERNS = {
    /**
     * Doji Patterns
     */
    DragonflyDoji: (candle: ICandle) => {
        return (
            candle &&
            candle.bodyWeight <= 5 &&
            candle.topWickWeight <= 25 &&
            candle.bottomWickWeight >= 70
        );
    },
    GravestoneDoji: (candle: ICandle) => {
        return (
            candle &&
            candle.bodyWeight <= 5 &&
            candle.bottomWickWeight <= 25 &&
            candle.topWickWeight >= 70
        );
    },
    LongLeggedDoji: (candle: ICandle) => {
        return (
            candle &&
            candle.bodyWeight <= 5 &&
            candle.bottomWickWeight >= 40 &&
            candle.topWickWeight >= 40
        );
    },
    /**
     * Hammer Patterns
     */
    Hammer: (candle: ICandle) => {
        return (
            candle &&
            candle.bodyWeight >= 5 &&
            candle.bodyWeight <= 30 &&
            candle.topWickWeight <= 15 &&
            candle.bottomWickWeight >= 65
        );
    },
    InverseHammer: (candle: ICandle) => {
        return (
            candle &&
            candle.bodyWeight >= 5 &&
            candle.bodyWeight <= 30 &&
            candle.bottomWickWeight <= 10 &&
            candle.topWickWeight >= 65
        );
    },
    /**
     * Spinning Top
     */
    SpinningTop: (candle: ICandle) => {
        return (
            candle &&
            candle.bodyWeight > 5 &&
            candle.bodyWeight <= 25 &&
            candle.bottomWickWeight >= 30 &&
            candle.topWickWeight >= 30
        );
    },
    /**
     * Marubozu
     */
    WhiteMarubozu: (candle: ICandle) => {
        return (
            candle &&
            candle.candleType === CandleType.Green &&
            candle.bodyWeight >= 90 &&
            candle.bottomWickWeight <= 10 &&
            candle.topWickWeight <= 10
        );
    },
    RedMarubozu: (candle: ICandle) => {
        return (
            candle &&
            candle.candleType === CandleType.Red &&
            candle.bodyWeight >= 90 &&
            candle.bottomWickWeight <= 10 &&
            candle.topWickWeight <= 10
        );
    },
};


export const PATTERNS = [
    /**
     * *******************************
     * Single Candlestick Patterns
     * *******************************
     */

    /**
     * *********************
     * Doji Patterns - S001, S002, S003
     * *********************
     *
     * Doji candlestick patterns are a type of candlestick formation that occurs
     * when the opening and closing prices of an asset are very close or nearly
     * equal. The resulting candlestick looks like a cross or a plus sign,
     * indicating indecision or a standoff between buyers and sellers.
     *
     * There are three type of Doji patterns such as Dragonfly Doji, Gravestone
     * Doji and Long-Legged Doji.
     *
     */

    /**
     * Dragonfly Doji - S001
     *
     * Identification:
     * Dragonfly Doji forms when open and close prices are at or near the high of
     * the candlestick.
     *
     * Direction:
     * Suggests that buyers have gained control after an initial decline. It could
     * signal a potential bullish reversal.
     */
    {
        id: 'S001',
        name: 'Dragonfly Doji',
        futurePotential: FuturePotential.Bullish,
        patternType: PatternType.SingleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            if (CORE_PATTERNS.DragonflyDoji(candle)) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    /**
     * Gravestone Doji - S002
     *
     * Identification:
     * The Gravestone Doji forms when open and close prices are at or near the low
     * of the candlestick.
     *
     * Direction:
     * Suggests that sellers have gained control after an initial advance. It could
     * signal a potential bearish reversal.
     */
    {
        id: 'S002',
        name: 'Gravestone Doji',
        futurePotential: FuturePotential.Bearish,
        patternType: PatternType.SingleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            if (CORE_PATTERNS.GravestoneDoji(candle)) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    /**
     * Long-Legged Doji - S003
     *
     * Identification:
     * The candlestick has long upper and lower wicks, and the open and close prices
     * are close to the middle of the range.
     *
     * Direction:
     * Reflects significant indecision in the market. Traders often look for
     * confirmation from subsequent candles.
     */
    {
        id: 'S003',
        name: 'Long-Legged Doji',
        futurePotential: FuturePotential.Neutral,
        patternType: PatternType.SingleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            if (CORE_PATTERNS.LongLeggedDoji(candle)) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    /**
     * *********************
     * Hammer Patterns - S004, S005
     * *********************
     *
     * The hammer is a single candlestick pattern that occurs in downtrends and
     * indicates a potential reversal in the trend. It has a long lower wick that is
     * at least twice the size of the real body. The real body is located at the top
     * end of the candlestick with little or no upper wick.
     *
     * There are two type of hammers such as Bullish Hammer and Bearish Hammer/Inversr
     * Hammer.
     */

    /**
     * Hammer - S004
     *
     * Identification:
     * Bullish Hammer or just Hammer with a long lower wick at least twice the size
     * of the real body. Body occurs near or at the top of the candle.
     *
     * Direction:
     * Occurs during downtrend, indicates potential reversal to uptrend. Long lower
     * wick shows buyers stepped in, rejected further downward price.
     */
    {
        id: 'S004',
        name: 'Hammer',
        futurePotential: FuturePotential.Bullish,
        patternType: PatternType.SingleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            if (CORE_PATTERNS.Hammer(candle)) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    /**
     * Inverse Hammer - S005
     *
     * Identification:
     * The Inverse Hammer has a long upper wick that is at least twice the size
     * of the real body. And the body occurs near or at the top of the candle.
     *
     * Direction:
     * This occurs during an uptrend and signals potential reversal to a downtrend.
     * The long lower wick shows sellers have stepped in and prevented further
     * upward price movement.
     */
    {
        id: 'S005',
        name: 'Inverse Hammer',
        futurePotential: FuturePotential.Bearish,
        patternType: PatternType.SingleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            if (CORE_PATTERNS.InverseHammer(candle)) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    /**
     * Spinning Top - S006
     *
     * Identification:
     * Spinning Top candlestick pattern is very similar to Long-Legged Doji but varies in the
     * body size. In Spinning Top candle, it can have slightly larger body compared to a typical
     * Doji
     *
     * Direction:
     * reflects a period of market indecision or consolidation. Traders and analysts view this
     * pattern as a sign that the forces of supply and demand are relatively balanced, and neither
     * bulls nor bears were able to dominate the market during the given time frame
     */
    {
        id: 'S006',
        name: 'Spinning Top',
        futurePotential: FuturePotential.Neutral,
        patternType: PatternType.SingleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            if (CORE_PATTERNS.SpinningTop(candle)) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    /**
     * White Marubozu - S007
     *
     * Identification:
     * A White Marubozu is a bullish candlestick pattern that forms when the opening price is the
     * same as the low and the closing price is the same as the high for a particular time period
     *
     * Direction:
     * The absence of upper and lower shadows signifies that buyers controlled the entire price
     * range from open to close without allowing sellers to push the price lower at any point
     * during the session
     */
    {
        id: 'S007',
        name: 'White Marubozu',
        futurePotential: FuturePotential.Bullish,
        patternType: PatternType.SingleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            if (CORE_PATTERNS.WhiteMarubozu(candle)) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    /**
     * Red Marubozu - S008
     *
     * Identification:
     * A Red Marubozu is a bearish candlestick pattern that forms when the opening price is the
     * same as the high and the closing price is the same as the low for a particular time period
     *
     * Direction:
     * The absence of upper and lower shadows signifies that sellers controlled the entire price
     * range from open to close without allowing buyers to push the price higher at any point
     * during the session
     */
    {
        id: 'S008',
        name: 'Red Marubozu',
        futurePotential: FuturePotential.Bearish,
        patternType: PatternType.SingleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            if (CORE_PATTERNS.RedMarubozu(candle)) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    {
        id: 'S009',
        name: 'Support',
        futurePotential: FuturePotential.Bullish,
        patternType: PatternType.SingleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            if (
                candle &&
                candle.bottomWickWeight >= 50 &&
                candle.bodyWeight >= 25
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    {
        id: 'S010',
        name: 'Rejection',
        futurePotential: FuturePotential.Bearish,
        patternType: PatternType.SingleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            if (
                candle &&
                candle.topWickWeight >= 50 &&
                candle.bodyWeight >= 25
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    {
        id: 'S011',
        name: 'Critical Support',
        futurePotential: FuturePotential.Bullish,
        patternType: PatternType.SingleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            if (
                candle &&
                candle.amplitudeStats &&
                candle.candleType === CandleType.Green && 
                candle.bodyWeight >= 30 &&
                candle.bottomWickWeight >= 45 &&
                candle.amplitudeStats.impact === CandleImpact.Critical &&
                (candle.tradeCountStats.impact === CandleImpact.Critical ||
                    candle.priceMovementStats.impact === CandleImpact.Critical)
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    {
        id: 'S011',
        name: 'Critical Rejection',
        futurePotential: FuturePotential.Bearish,
        patternType: PatternType.SingleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            if (
                candle &&
                candle.amplitudeStats &&
                candle.candleType === CandleType.Red && 
                candle.topWickWeight >= 45 &&
                candle.bodyWeight >= 30 &&
                candle.amplitudeStats.impact === CandleImpact.Critical &&
                (candle.tradeCountStats.impact === CandleImpact.Critical ||
                    candle.priceMovementStats.impact === CandleImpact.Critical)
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },

    /**
     * *******************************
     * Two Candlestick Patterns
     * *******************************
     */

    /**
     * Bullish Engulfing - D001
     *
     * Identification:
     * A Bullish Engulfing is a bullish candlestick pattern that forms when a small bearish
     * candlestick is followed by a larger bullish candlestick that completely engulfs the
     * previous candle
     *
     * Direction:
     * The Bullish Engulfing pattern suggests a potential reversal of the prevailing downtrend.
     * The large bullish candle indicates that buyers have overwhelmed sellers, reversing the
     * sentiment from bearish to bullish. The pattern is considered more significant if the
     * engulfing candle has a long real body, indicating strong buying momentum
     */
    {
        id: 'D001',
        name: 'Bullish Engulfing',
        futurePotential: FuturePotential.Bullish,
        patternType: PatternType.DoubleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            const currentCandle = candle;
            const previousCandle = pastCandles[pastCandles.length - 1];
            if (
                previousCandle &&
                previousCandle.candleType === CandleType.Red &&
                previousCandle.bodyWeight >= 40 &&
                currentCandle &&
                currentCandle.candleType === CandleType.Green &&
                currentCandle.close >= previousCandle.open &&
                currentCandle.bodyWeight >= 45
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    /**
     * Bearish Engulfing - D002
     *
     * Identification:
     * A Bearish Engulfing is a bearish candlestick pattern that occurs when a small bullish
     * candlestick is followed by a larger bearish candlestick that completely engulfs the
     * previous candle
     *
     * Direction:
     * The Bearish Engulfing pattern suggests a potential reversal of the prevailing uptrend.
     * The large bearish candle indicates that sellers have overwhelmed buyers, reversing the
     * sentiment from bullish to bearish. The pattern is considered more significant if the
     * engulfing candle has a long real body, indicating strong selling momentum
     */
    {
        id: 'D002',
        name: 'Bearish Engulfing',
        futurePotential: FuturePotential.Bearish,
        patternType: PatternType.DoubleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            const currentCandle = candle;
            const previousCandle = pastCandles[pastCandles.length - 1];
            if (
                previousCandle &&
                previousCandle.candleType === CandleType.Green &&
                previousCandle.bodyWeight >= 40 &&
                currentCandle &&
                currentCandle.candleType === CandleType.Red &&
                currentCandle.bodyWeight >= 60 &&
                currentCandle.close <= previousCandle.open
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    {
        id: 'D003',
        name: 'Double Support',
        futurePotential: FuturePotential.Bullish,
        patternType: PatternType.DoubleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            const currentCandle = candle;
            const previousCandle = pastCandles[pastCandles.length - 1];
            if (
                previousCandle &&
                previousCandle.bottomWickWeight >= 50 &&
                previousCandle.bodyWeight >= 25 &&
                currentCandle &&
                currentCandle.bottomWickWeight >= 50 &&
                currentCandle.bodyWeight >= 25
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    {
        id: 'D004',
        name: 'Double Rejection',
        futurePotential: FuturePotential.Bearish,
        patternType: PatternType.DoubleCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            const currentCandle = candle;
            const previousCandle = pastCandles[pastCandles.length - 1];
            if (
                previousCandle &&
                previousCandle.topWickWeight >= 50 &&
                previousCandle.bodyWeight >= 25 &&
                currentCandle &&
                currentCandle.topWickWeight >= 50 &&
                currentCandle.bodyWeight >= 25
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },

    /**
     * *******************************
     * Three or More Candlestick Patterns
     * *******************************
     */

    /**
     * Morning Start (3 Candle) - M001
     */
    {
        id: 'M001',
        name: 'Morning Start (3 Candle)',
        futurePotential: FuturePotential.Bullish,
        patternType: PatternType.MultiCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            const firstCandle = pastCandles[pastCandles.length - 2];
            const secondCandle = pastCandles[pastCandles.length - 1];
            const currentCandle = candle;
            if (
                // First Candle
                firstCandle &&
                firstCandle.candleType === CandleType.Red &&
                firstCandle.bodyWeight >= 55 &&
                // Second Candle - Long-Legged Doji/Spinning Top
                (CORE_PATTERNS.LongLeggedDoji(secondCandle) || CORE_PATTERNS.SpinningTop(secondCandle)) &&
                // Third Candle
                currentCandle.candleType === CandleType.Green &&
                currentCandle.bodyWeight >= 60
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    /**
     * Three Line Strike (4 Candle) - M002
     */
    {
        id: 'M002',
        name: 'Three Line Strike (4 Candle)',
        futurePotential: FuturePotential.Bullish,
        patternType: PatternType.MultiCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            const currentCandle = candle;
            const thirdCandle = pastCandles[pastCandles.length - 1];
            const secondCandle = pastCandles[pastCandles.length - 2];
            const firstCandle = pastCandles[pastCandles.length - 3];
            if (
                firstCandle &&
                firstCandle.candleType === CandleType.Red &&
                secondCandle &&
                secondCandle.candleType === CandleType.Red &&
                thirdCandle &&
                thirdCandle.candleType === CandleType.Red &&
                // Current Candle
                currentCandle.candleType === CandleType.Green &&
                currentCandle.close >= firstCandle.open &&
                currentCandle.close >= secondCandle.high &&
                currentCandle.close >= thirdCandle.high &&
                currentCandle.low <= firstCandle.low &&
                currentCandle.low <= secondCandle.low &&
                currentCandle.low <= thirdCandle.low
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    /**
     * Three Candle Strike (3 ICandle) - M003
     */
    {
        id: 'M003',
        name: 'Three Candle Strike (3 Candle)',
        futurePotential: FuturePotential.Bullish,
        patternType: PatternType.MultiCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            const currentCandle = candle;
            const secondCandle = pastCandles[pastCandles.length - 1];
            const firstCandle = pastCandles[pastCandles.length - 2];
            if (
                firstCandle &&
                firstCandle.candleType === CandleType.Green &&
                firstCandle.bodyWeight >= 65 &&
                secondCandle &&
                secondCandle.candleType === CandleType.Red &&
                secondCandle.bodyWeight >= 65 &&
                secondCandle.close >= firstCandle.open &&
                currentCandle &&
                currentCandle.candleType === CandleType.Green &&
                currentCandle.bodyWeight >= 65 &&
                currentCandle.close >= secondCandle.open
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    {
        id: 'M004',
        name: 'Tripple Support',
        futurePotential: FuturePotential.Bullish,
        patternType: PatternType.MultiCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            const currentCandle = candle;
            const secondCandle = pastCandles[pastCandles.length - 1];
            const firstCandle = pastCandles[pastCandles.length - 2];
            if (
                firstCandle &&
                firstCandle.bottomWickWeight >= 50 &&
                firstCandle.bodyWeight >= 30 &&
                secondCandle &&
                secondCandle.bottomWickWeight >= 50 &&
                secondCandle.bodyWeight >= 30 &&
                currentCandle &&
                currentCandle.bottomWickWeight >= 50 &&
                currentCandle.bodyWeight >= 30
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    },
    {
        id: 'M005',
        name: 'Tripple Rejection',
        futurePotential: FuturePotential.Bearish,
        patternType: PatternType.MultiCandle,
        parser: (candle: ICandle, pastCandles: ICandle[] = []): PatternResult | null => {
            const currentCandle = candle;
            const secondCandle = pastCandles[pastCandles.length - 1];
            const firstCandle = pastCandles[pastCandles.length - 2];
            if (
                firstCandle &&
                firstCandle.topWickWeight >= 50 &&
                firstCandle.bodyWeight >= 30 &&
                secondCandle &&
                secondCandle.topWickWeight >= 50 &&
                secondCandle.bodyWeight >= 30 &&
                currentCandle &&
                currentCandle.topWickWeight >= 50 &&
                currentCandle.bodyWeight >= 30
            ) {
                return {
                    impact: candle.impact,
                };
            }
            return null;
        },
    }
];

/**
 * This function will update the `PATTERNS` array to include more than one occurence of Single ICandle Patterns
 *
 */

const SINLE_CANDLE_PATTERNS = PATTERNS.filter((pattern) => pattern.patternType === PatternType.SingleCandle);

SINLE_CANDLE_PATTERNS.forEach((pattern) => {
    // Two ICandle
    const twoCandlePattern = { ...pattern };
    twoCandlePattern.id = `${pattern.id}-2`;
    twoCandlePattern.name = `${pattern.name} (2 ICandle)`;
    twoCandlePattern.patternType = PatternType.DoubleCandle;
    twoCandlePattern.parser = (candle: ICandle, pastCandles: ICandle[] = []) => {
        const currentCandle = candle;
        const pastCandle = pastCandles[pastCandles.length - 1];
        if (pattern.parser(currentCandle) && pattern.parser(pastCandle)) {
            return {
                impact: CandleImpact.High,
            };
        }
        return null;
    };
    PATTERNS.push(twoCandlePattern);
    // Three ICandle
    const threeCandlePattern = { ...pattern };
    threeCandlePattern.id = `${pattern.id}-3`;
    threeCandlePattern.name = `${pattern.name} (3 ICandle)`;
    threeCandlePattern.patternType = PatternType.DoubleCandle;
    threeCandlePattern.parser = (candle: ICandle, pastCandles: ICandle[] = []) => {
        const firstCandle = pastCandles[pastCandles.length - 2];
        const secondCandle = pastCandles[pastCandles.length - 1];
        const currentCandle = candle;
        if (pattern.parser(firstCandle) && pattern.parser(secondCandle) && pattern.parser(currentCandle)) {
            return {
                impact: CandleImpact.High,
            };
        }
        return null;
    };
    PATTERNS.push(threeCandlePattern);
    // Four ICandle
    const fourCandlePattern = { ...pattern };
    fourCandlePattern.id = `${pattern.id}-4`;
    fourCandlePattern.name = `${pattern.name} (4 ICandle)`;
    fourCandlePattern.patternType = PatternType.DoubleCandle;
    fourCandlePattern.parser = (candle: ICandle, pastCandles: ICandle[] = []) => {
        const firstCandle = pastCandles[pastCandles.length - 3];
        const secondCandle = pastCandles[pastCandles.length - 2];
        const thirdCandle = pastCandles[pastCandles.length - 1];
        const currentCandle = candle;
        if (
            pattern.parser(firstCandle) &&
            pattern.parser(secondCandle) &&
            pattern.parser(thirdCandle) &&
            pattern.parser(currentCandle)
        ) {
            return {
                impact: CandleImpact.High,
            };
        }
        return null;
    };
    PATTERNS.push(fourCandlePattern);
});

export function getCandlestickPatterns(activeCandle: ICandle, pastCandles: ICandle[]) {
    const matchedPatterns = PATTERNS.map(pattern => {
        const isMatch = pattern.parser(activeCandle, pastCandles)
        if (!isMatch) return null;
        return {
            id: pattern.id,
            name: pattern.name,
            patternType: pattern.patternType,
            futurePotential: pattern.futurePotential,
            result: isMatch
        }
    })
    return matchedPatterns.filter(Boolean);
}