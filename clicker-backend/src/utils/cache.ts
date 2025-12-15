import NodeCache from 'node-cache';

const CACHE_ENABLED = process.env.CACHE_ENABLED !== 'false';

const cache = new NodeCache({stdTTL: 5, checkperiod: 1});

export function cacheGet(key: string): unknown {
  if (!CACHE_ENABLED) return undefined;
  return cache.get(key);
}

export function cacheSet(key: string, value: unknown, ttlSeconds?: number): void {
  if (!CACHE_ENABLED) return;
  cache.set(key, value, ttlSeconds ?? 5);
}

export default {get: cacheGet, set: cacheSet};
