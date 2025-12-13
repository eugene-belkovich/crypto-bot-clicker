'use client';

import {cn} from '@/lib/utils';

interface UserRankCardProps {
  username?: string;
  photoUrl?: string;
  rank: number;
  score: number;
}

function formatScore(score: number | undefined): string {
  const value = score ?? 0;
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString('en-US');
}

function getRankBadgeStyle(rank: number): string {
  if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white';
  if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700';
  if (rank === 3) return 'bg-gradient-to-br from-orange-400 to-orange-500 text-white';
  if (rank <= 10) return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white';
  if (rank <= 25) return 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white';
  return 'bg-gradient-to-br from-gray-500 to-gray-600 text-white';
}

export function UserRankCard({username, photoUrl, rank, score}: UserRankCardProps) {
  return (
    <div style={{padding: '16px 20px'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
        <div className="relative">
          <div
            className="rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 ring-4 ring-white/30"
            style={{width: '72px', height: '72px'}}
          >
            {photoUrl ? (
              <img src={photoUrl} alt={username} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-bold"
                style={{fontSize: '20px'}}
              >
                You
              </div>
            )}
          </div>
          <div
            className={cn(
              'absolute flex items-center justify-center font-bold',
              'ring-2 ring-white/50 shadow-lg',
              getRankBadgeStyle(rank)
            )}
            style={{
              bottom: '-4px',
              right: '-4px',
              minWidth: '28px',
              height: '28px',
              padding: '0 6px',
              borderRadius: '14px',
              fontSize: '13px'
            }}
          >
            {rank > 0 ? rank : '?'}
          </div>
        </div>

        <p className="font-bold text-white drop-shadow-md" style={{fontSize: '16px'}}>
          @{username || 'anonymous'}
        </p>

        <p className="font-bold text-white tabular-nums drop-shadow-md" style={{fontSize: '28px'}}>
          {formatScore(score)}
        </p>
      </div>
    </div>
  );
}
