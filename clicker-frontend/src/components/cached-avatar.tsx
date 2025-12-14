'use client';

import {useEffect, useState} from 'react';

const CACHE_KEY_PREFIX = 'avatar_url_';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  url: string;
  timestamp: number;
}

function getCachedUrl(telegramId: string): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${telegramId}`);
    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${telegramId}`);
      return null;
    }

    return entry.url;
  } catch {
    return null;
  }
}

function setCachedUrl(telegramId: string, url: string): void {
  if (typeof window === 'undefined') return;

  try {
    const entry: CacheEntry = {url, timestamp: Date.now()};
    localStorage.setItem(`${CACHE_KEY_PREFIX}${telegramId}`, JSON.stringify(entry));
  } catch {
    // localStorage might be full or disabled
  }
}

interface CachedAvatarProps {
  telegramId: string;
  photoUrl: string | null;
  fallbackName: string;
  size?: number;
  className?: string;
}

export function CachedAvatar({telegramId, photoUrl, fallbackName, size = 32, className = ''}: CachedAvatarProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(() => getCachedUrl(telegramId));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // If we have a photoUrl and it's different from cached, update cache
    if (photoUrl) {
      const cached = getCachedUrl(telegramId);
      if (cached !== photoUrl) {
        setCachedUrl(telegramId, photoUrl);
      }
      if (!imgSrc) {
        setImgSrc(photoUrl);
      }
    }
  }, [telegramId, photoUrl, imgSrc]);

  const fallbackLetter = (fallbackName || '?')[0].toUpperCase();
  const showFallback = !imgSrc || hasError;

  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-white/20 ${className}`}
      style={{width: size, height: size}}
    >
      {showFallback ? (
        <span className="text-white font-bold" style={{fontSize: size * 0.45}}>
          {fallbackLetter}
        </span>
      ) : (
        <img
          src={imgSrc}
          alt=""
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
