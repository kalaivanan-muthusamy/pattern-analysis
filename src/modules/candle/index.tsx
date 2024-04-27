import { CandleType } from "./constants";

export interface IBasicCandle {
    openTime: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    baseAssetvolume: number;
    closeTime: Date;
    quoteAssetvolume: number;
    noOfTrades: number;
    candleType: CandleType;
    priceMovement: number;
    amplitude: number;
    bodyWeight: number;
    topWickWeight: number;
    bottomWickWeight: number;
}

enum CandleImpact {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Critical = 'Critical'
}

interface CalculatedStats {
    min: number;
    max: number;
    avg: number;
    mid: number;
    value60: number;
    value80: number;
    isAboveAverage: boolean;
    isMax: boolean;
    isMin: boolean;
    impact: CandleImpact
}

export interface ICandle extends IBasicCandle {
    priceMovementStats: CalculatedStats;
    amplitudeStats: CalculatedStats;
    tradeCountStats: CalculatedStats;
    volumeStats: CalculatedStats;
    impact: CandleImpact
}

export function formatCandle(candleValues: Array<string | number>): IBasicCandle {
    /**
     * Sample candle values
     * 
     * [
     *   1499040000000,      // Kline open time
     *   "0.01634790",       // Open price
     *   "0.80000000",       // High price
     *   "0.01575800",       // Low price
     *   "0.01577100",       // Close price
     *   "148976.11427815",  // Volume
     *   1499644799999,      // Kline Close time
     *   "2434.19055334",    // Quote asset volume
     *   308,                // Number of trades
     *   "1756.87402397",    // Taker buy base asset volume
     *   "28.46694368",      // Taker buy quote asset volume
     *   "0"                 // Unused field, ignore.
     * ]
     *
     */

    const candle = candleValues.map(val => typeof val === 'string' ? parseFloat(val) : val);
    const open = candle[1];
    const high = candle[2];
    const low = candle[3];
    const close = candle[4];

    // 1. Identify Candle Tyope
    const candleType = close >= open ? CandleType.Green : CandleType.Red;

    // 2. Calculate Price Movement and Amplitude
    let amplitude: number;
    let priceMovement: number;
    if (candleType === CandleType.Green) {
        amplitude = (Math.abs(low - high) / low) * 100;
        priceMovement = (Math.abs(open - close) / open) * 100;
    } else {
        amplitude = (Math.abs(high - low) / high) * 100;
        priceMovement = (Math.abs(open - close) / open) * 100;
    }

    // 3. Calculate the weight of the body, top wick, bottom wick
    const totalRange = high - low;
    const bodyWidth = Math.abs(close - open);
    const topWickWidth = high - Math.max(open, close);
    const bottomWickWidth = Math.min(open, close) - low;

    const bodyWeight = (bodyWidth / totalRange) * 100;
    const topWickWeight = (topWickWidth / totalRange) * 100;
    const bottomWickWeight = (bottomWickWidth / totalRange) * 100;

    return {
        openTime: new Date(candle[0]),
        open,
        high,
        low,
        close,
        baseAssetvolume: candle[5],
        closeTime: new Date(candle[6]),
        quoteAssetvolume: candle[7],
        noOfTrades: candle[8],
        candleType,
        bodyWeight: parseFloat(bodyWeight.toFixed(2)),
        topWickWeight: parseFloat(topWickWeight.toFixed(2)),
        bottomWickWeight: parseFloat(bottomWickWeight.toFixed(2)),
        amplitude: parseFloat(amplitude.toFixed(2)),
        priceMovement: parseFloat(priceMovement.toFixed(2)),
    };
}

export function processCandles(candleValues: Array<string | number>[], avgLength = 14): ICandle[] {
    const allCandles = candleValues.map(candle => formatCandle(candle)) as ICandle[];

    // Calculate the min, max and avg values for price movement, amplitude, trades, volume
    for (let i = avgLength; i < allCandles.length; i++) {
        const pastCandles = allCandles.slice(i - avgLength, i);
        const activeCandle = allCandles[i];

        const priceMovementStats = calculateStats(pastCandles, activeCandle, 'priceMovement');
        activeCandle.priceMovementStats = { ...priceMovementStats }

        const amplitudeStats = calculateStats(pastCandles, activeCandle, 'amplitude');
        activeCandle.amplitudeStats = { ...amplitudeStats }

        const tradeCountStats = calculateStats(pastCandles, activeCandle, 'noOfTrades');
        activeCandle.tradeCountStats = { ...tradeCountStats }

        const volumeStats = calculateStats(pastCandles, activeCandle, 'baseAssetvolume');
        activeCandle.volumeStats = { ...volumeStats }

        // Calculate candle impact
        let impact = CandleImpact.Low;
        if (
            amplitudeStats.impact === CandleImpact.Critical &&
            (volumeStats.impact === CandleImpact.Critical || tradeCountStats.impact === CandleImpact.Critical)
        ) {
            impact = CandleImpact.Critical;
        } else if (
            amplitudeStats.impact === CandleImpact.High &&
            (matchImpact(volumeStats.impact, CandleImpact.High) || matchImpact(tradeCountStats.impact, CandleImpact.High))
        ) {
            impact = CandleImpact.High;
        } else if (
            amplitudeStats.impact === CandleImpact.Medium &&
            (matchImpact(volumeStats.impact, CandleImpact.Medium) || matchImpact(tradeCountStats.impact, CandleImpact.Medium))
        ) {
            impact = CandleImpact.Medium;
        }
        activeCandle.impact = impact;
    }
    return allCandles;
}

function calculateStats(allCandles: ICandle[], candle: ICandle, key: string) {
    const values = allCandles.map(candle => candle[key]);
    const current = candle[key];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((acc, pm) => acc + pm, 0) / values.length;
    const mid = min + 0.5 * (max - min);
    const value60 = min + 0.6 * (max - min);
    const value80 = min + 0.8 * (max - min);
    let impact = CandleImpact.Low;
    if (current > value80) {
        impact = CandleImpact.Critical
    } else if (current > value60) {
        impact = CandleImpact.High
    } else if (current > avg || current > mid) {
        impact = CandleImpact.Medium
    }
    return {
        current,
        min,
        max,
        avg,
        mid,
        value60,
        value80,
        isAboveAverage: candle[key] > avg,
        isMax: candle[key] >= max,
        isMin: candle[key] <= min,
        impact
    }
}

function matchImpact(impact: CandleImpact, match: CandleImpact) {
    const impactToMatch = [match];
    if (match === CandleImpact.High) {
        impactToMatch.push(CandleImpact.Critical);
    } else if (match === CandleImpact.Medium) {
        impactToMatch.push(CandleImpact.High, CandleImpact.Critical)
    } else if (match === CandleImpact.Low) {
        impactToMatch.push(CandleImpact.Medium, CandleImpact.High, CandleImpact.Critical)
    }
    return impactToMatch.includes(impact)
}