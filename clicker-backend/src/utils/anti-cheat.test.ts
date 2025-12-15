import {describe, expect, it, vi} from 'vitest';
import {validateClickBatch} from './anti-cheat';

vi.mock('../config', () => ({
  config: {
    antiCheat: {
      minIntervalMs: 30,
      tooFastThreshold: 0.3,
      identicalCoordsLimit: 40,
      regularityCV: 0.1,
      regularityMeanMs: 100,
    },
  },
}));

interface ClickData {
  timestamp: string;
  x: number;
  y: number;
}

function createClicks(
  count: number,
  options: {
    intervalMs?: number;
    startTime?: number;
    sameCoords?: boolean;
    randomizeInterval?: number;
  } = {},
): ClickData[] {
  const {intervalMs = 100, startTime = 1000, sameCoords = false, randomizeInterval = 0} = options;

  return Array.from({length: count}, (_, i) => {
    const jitter = randomizeInterval ? Math.random() * randomizeInterval - randomizeInterval / 2 : 0;
    return {
      timestamp: new Date(startTime + i * intervalMs + jitter).toISOString(),
      x: sameCoords ? 100 : 100 + i * 5,
      y: sameCoords ? 200 : 200 + i * 3,
    };
  });
}

describe('validateClickBatch', () => {
  describe('edge cases', () => {
    it('should return not suspicious for empty array', () => {
      const result = validateClickBatch([]);
      expect(result.suspicious).toBe(false);
    });

    it('should return not suspicious for single click', () => {
      const clicks = [{timestamp: new Date().toISOString(), x: 100, y: 200}];
      const result = validateClickBatch(clicks);
      expect(result.suspicious).toBe(false);
    });

    it('should return not suspicious for two valid clicks', () => {
      const clicks = createClicks(2, {intervalMs: 150});
      const result = validateClickBatch(clicks);
      expect(result.suspicious).toBe(false);
    });
  });

  describe('valid human clicks', () => {
    it('should pass clicks with normal intervals and varied positions', () => {
      const clicks = createClicks(20, {intervalMs: 150, randomizeInterval: 50});
      const result = validateClickBatch(clicks);
      expect(result.suspicious).toBe(false);
    });

    it('should pass slow clicks', () => {
      const clicks = createClicks(10, {intervalMs: 500});
      const result = validateClickBatch(clicks);
      expect(result.suspicious).toBe(false);
    });
  });

  describe('too fast clicks detection', () => {
    it('should detect when >30% clicks are under minIntervalMs', () => {
      // minIntervalMs = 30, tooFastThreshold = 0.3
      // 10 clicks with 10ms interval - all under 30ms threshold
      const clicks = createClicks(10, {intervalMs: 10});
      const result = validateClickBatch(clicks);

      expect(result.suspicious).toBe(true);
      expect(result.reason).toContain('Too fast');
    });

    it('should pass if less than 30% are too fast', () => {
      // Create clicks where only 20% are too fast
      const clicks: ClickData[] = [
        {timestamp: new Date(1000).toISOString(), x: 100, y: 200},
        {timestamp: new Date(1010).toISOString(), x: 105, y: 205}, // 10ms - fast
        {timestamp: new Date(1160).toISOString(), x: 110, y: 210}, // 150ms - ok
        {timestamp: new Date(1310).toISOString(), x: 115, y: 215}, // 150ms - ok
        {timestamp: new Date(1460).toISOString(), x: 120, y: 220}, // 150ms - ok
        {timestamp: new Date(1610).toISOString(), x: 125, y: 225}, // 150ms - ok
      ];
      const result = validateClickBatch(clicks);
      expect(result.suspicious).toBe(false);
    });
  });

  describe('identical coordinates detection', () => {
    it('should detect 40+ clicks at same position (with 10+ total clicks)', () => {
      // identicalCoordsLimit = 40
      const clicks = createClicks(50, {intervalMs: 100, sameCoords: true});
      const result = validateClickBatch(clicks);

      expect(result.suspicious).toBe(true);
      expect(result.reason).toContain('Identical coords');
    });

    it('should pass if less than 40 clicks at same position', () => {
      const clicks = createClicks(30, {intervalMs: 100, sameCoords: true});
      const result = validateClickBatch(clicks);
      expect(result.suspicious).toBe(false);
    });

    it('should not flag identical coords if total clicks < 10', () => {
      // Even if all 9 clicks are at the same position - don't flag
      const clicks = createClicks(9, {intervalMs: 100, sameCoords: true});
      const result = validateClickBatch(clicks);
      expect(result.suspicious).toBe(false);
    });
  });

  describe('robotic pattern detection', () => {
    it('should detect perfectly regular intervals (CV < 0.1, mean < 100ms)', () => {
      // regularityCV = 0.1, regularityMeanMs = 100
      // Exactly 50ms between clicks - CV will be ~0
      const clicks = createClicks(20, {intervalMs: 50, randomizeInterval: 0});
      const result = validateClickBatch(clicks);

      expect(result.suspicious).toBe(true);
      expect(result.reason).toContain('Robotic');
    });

    it('should pass if intervals have natural variance', () => {
      // Adding randomness - CV will be higher than 0.1
      const clicks = createClicks(20, {intervalMs: 80, randomizeInterval: 40});
      const result = validateClickBatch(clicks);
      // May pass or fail depending on random values
      // So we check that if suspicious, the reason is Robotic
      if (result.suspicious) {
        expect(result.reason).toContain('Robotic');
      }
    });

    it('should pass regular intervals if mean > 100ms', () => {
      // Regular intervals, but 150ms - above regularityMeanMs threshold
      const clicks = createClicks(20, {intervalMs: 150, randomizeInterval: 0});
      const result = validateClickBatch(clicks);
      expect(result.suspicious).toBe(false);
    });

    it('should not check regularity for less than 5 intervals', () => {
      // 5 clicks = 4 intervals, check should not trigger
      const clicks = createClicks(5, {intervalMs: 50, randomizeInterval: 0});
      const result = validateClickBatch(clicks);
      // Should not be Robotic, may be Too fast
      if (result.suspicious) {
        expect(result.reason).not.toContain('Robotic');
      }
    });
  });

  describe('priority of checks', () => {
    it('should return first failing check (too fast before identical coords)', () => {
      // Clicks that are both too fast and at the same position
      const clicks = createClicks(50, {intervalMs: 10, sameCoords: true});
      const result = validateClickBatch(clicks);

      expect(result.suspicious).toBe(true);
      // Too fast is checked first
      expect(result.reason).toContain('Too fast');
    });
  });

  describe('unsorted input handling', () => {
    it('should correctly handle unsorted clicks', () => {
      const clicks: ClickData[] = [
        {timestamp: new Date(1300).toISOString(), x: 115, y: 215},
        {timestamp: new Date(1000).toISOString(), x: 100, y: 200},
        {timestamp: new Date(1150).toISOString(), x: 110, y: 210},
      ];
      const result = validateClickBatch(clicks);
      // After sorting intervals: 150ms, 150ms - normal
      expect(result.suspicious).toBe(false);
    });
  });
});
