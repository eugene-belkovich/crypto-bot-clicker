/**
 * Anti-Cheat System — detects autoclickers and bots.
 *
 * Checks:
 * 1. Too fast — >30% clicks under 30ms interval
 * 2. Identical coords — 40+ clicks at same position
 * 3. Robotic pattern — CV < 10% with mean < 100ms (too regular)
 *
 * Human: 120ms, 95ms, 140ms, 88ms (natural variance)
 * Bot:   50ms, 50ms, 50ms, 50ms (perfectly even)
 */
import {config} from '../config';
import {ClickData} from '../interfaces';

export interface ValidationResult {
  suspicious: boolean;
  reason: string;
}

/** Calculates intervals between sorted clicks */
function getIntervals(clicks: ClickData[]): number[] {
  const sorted = [...clicks].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    intervals.push(new Date(sorted[i].timestamp).getTime() - new Date(sorted[i - 1].timestamp).getTime());
  }
  return intervals;
}

/** Check 1: Too many clicks faster than MIN_INTERVAL_MS */
function checkTooFastClicks(intervals: number[], totalClicks: number): ValidationResult | null {
  const MIN_INTERVAL_MS = config.antiCheat.minIntervalMs;
  const TOO_FAST_THRESHOLD = config.antiCheat.tooFastThreshold;

  const tooFastCount = intervals.filter(i => i < MIN_INTERVAL_MS).length;
  if (tooFastCount > totalClicks * TOO_FAST_THRESHOLD) {
    return {
      suspicious: true,
      reason: `Too fast: ${tooFastCount}/${totalClicks} clicks under ${MIN_INTERVAL_MS}ms`,
    };
  }
  return null;
}

/** Check 2: Too many clicks at identical coordinates */
function checkIdenticalCoords(clicks: ClickData[]): ValidationResult | null {
  const IDENTICAL_COORDS_LIMIT = config.antiCheat.identicalCoordsLimit;

  if (clicks.length < 10) return null;

  const coordMap = new Map<string, number>();
  for (const click of clicks) {
    const key = `${Math.round(click.x)},${Math.round(click.y)}`;
    coordMap.set(key, (coordMap.get(key) || 0) + 1);
  }

  const maxSameCoord = Math.max(...coordMap.values());
  if (maxSameCoord >= IDENTICAL_COORDS_LIMIT) {
    return {
      suspicious: true,
      reason: `Identical coords: ${maxSameCoord} clicks at same position`,
    };
  }
  return null;
}

/** Check 3: Too regular intervals (low CV = robotic) */
function checkRoboticPattern(intervals: number[]): ValidationResult | null {
  const REGULARITY_CV = config.antiCheat.regularityCV;
  const REGULARITY_MEAN_MS = config.antiCheat.regularityMeanMs;

  if (intervals.length < 5) return null;

  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, i) => sum + Math.pow(i - mean, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? stdDev / mean : 0;

  if (cv < REGULARITY_CV && mean < REGULARITY_MEAN_MS) {
    return {
      suspicious: true,
      reason: `Robotic pattern: CV=${(cv * 100).toFixed(1)}%, mean=${mean.toFixed(0)}ms`,
    };
  }
  return null;
}

/** Validates click batch for suspicious activity */
export function validateClickBatch(clicks: ClickData[]): ValidationResult {
  if (clicks.length < 2) {
    return {suspicious: false, reason: ''};
  }

  const intervals = getIntervals(clicks);

  return (
    checkTooFastClicks(intervals, clicks.length) ||
    checkIdenticalCoords(clicks) ||
    checkRoboticPattern(intervals) || {suspicious: false, reason: ''}
  );
}
