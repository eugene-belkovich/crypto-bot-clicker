import {config} from '../config';
import {ClickData} from '../interfaces';

export interface ValidationResult {
    suspicious: boolean;
    reason: string;
}

export type AntiCheatConfig = typeof config.antiCheat;

export function validateClickBatch(clicks: ClickData[]): ValidationResult {
    if (clicks.length < 2) {
        return {suspicious: false, reason: ''};
    }

    const antiCheat = config.antiCheat;

    const sorted = [...clicks].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // 1. Check intervals between clicks
    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
        const interval = new Date(sorted[i].timestamp).getTime() - new Date(sorted[i - 1].timestamp).getTime();
        intervals.push(interval);
    }

    const tooFastCount = intervals.filter(i => i < antiCheat.minIntervalMs).length;
    if (tooFastCount > clicks.length * antiCheat.tooFastThreshold) {
        return {
            suspicious: true,
            reason: `Too fast: ${tooFastCount}/${clicks.length} clicks under ${antiCheat.minIntervalMs}ms`,
        };
    }

    // 2. Check identical coordinates
    const coordMap = new Map<string, number>();
    for (const click of clicks) {
        const key = `${Math.round(click.x)},${Math.round(click.y)}`;
        coordMap.set(key, (coordMap.get(key) || 0) + 1);
    }

    const maxSameCoord = Math.max(...coordMap.values());
    if (maxSameCoord >= antiCheat.identicalCoordsLimit && clicks.length >= 10) {
        return {
            suspicious: true,
            reason: `Identical coords: ${maxSameCoord} clicks at same position`,
        };
    }

    // 3. Check regularity (too regular intervals = bot)
    if (intervals.length >= 5) {
        const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sum, i) => sum + Math.pow(i - mean, 2), 0) / intervals.length;
        const stdDev = Math.sqrt(variance);
        const cv = mean > 0 ? stdDev / mean : 0;

        if (cv < antiCheat.regularityCV && mean < antiCheat.regularityMeanMs) {
            return {
                suspicious: true,
                reason: `Robotic pattern: CV=${(cv * 100).toFixed(1)}%, mean=${mean.toFixed(0)}ms`,
            };
        }
    }

    return {suspicious: false, reason: ''};
}
