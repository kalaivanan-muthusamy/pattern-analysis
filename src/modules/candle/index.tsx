import { CandleType } from "./constants";

export interface Candle {
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
    bodyWidthPercentage: number;
    topWickWidthPercentage: number;
    bottomWickWidthPercentage: number;
}

export function formatCandle(candleValues: Array<string | number>): Candle {
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
    let amplitude = null;
    let priceMovement = null;
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

    const bodyWidthPercentage = (bodyWidth / totalRange) * 100;
    const topWickWidthPercentage = (topWickWidth / totalRange) * 100;
    const bottomWickWidthPercentage = (bottomWickWidth / totalRange) * 100;

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
        bodyWidthPercentage: parseFloat(bodyWidthPercentage.toFixed(2)),
        topWickWidthPercentage: parseFloat(topWickWidthPercentage.toFixed(2)),
        bottomWickWidthPercentage: parseFloat(bottomWickWidthPercentage.toFixed(2)),
        amplitude: parseFloat(amplitude.toFixed(2)),
        priceMovement: parseFloat(priceMovement.toFixed(2)),
    };
}

export function processCandles(candles: Candle[]) {
    
}

const candle = [
    1714060800000,
    "64135.93000000",
    "65297.94000000",
    "63971.48000000",
    "64498.34000000",
    "9681.66424000",
    1714089599999,
    "625659924.58536440",
    420926,
    "4620.21784000",
    "298531589.85404570",
    "0"
];

console.log(formatCandle(candle));