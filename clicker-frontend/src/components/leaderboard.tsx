'use client';

import {cn} from '@/lib/utils';
import type {LeaderboardEntry} from '@/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserTelegramId?: string;
  localScore?: number;
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

function getDisplayName(entry: LeaderboardEntry): string {
  return entry.username || entry.firstName || 'Anonymous';
}

function getInitials(entry: LeaderboardEntry): string {
  const name = entry.username || entry.firstName;
  if (!name) return '?';
  return name.slice(0, 2).toUpperCase();
}

function getRankStyle(rank: number): {badge: string; row: string} {
  if (rank === 1) {
    return {
      badge: 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white',
      row: 'bg-amber-50'
    };
  }
  if (rank === 2) {
    return {
      badge: 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700',
      row: 'bg-gray-50'
    };
  }
  if (rank === 3) {
    return {
      badge: 'bg-gradient-to-br from-orange-400 to-orange-500 text-white',
      row: 'bg-orange-50'
    };
  }
  return {
    badge: 'bg-gray-100 text-gray-600',
    row: 'bg-white'
  };
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  localScore?: number;
}

function LeaderboardRow({entry, isCurrentUser, localScore}: LeaderboardRowProps) {
  const {rank, score} = entry;
  const {badge, row} = getRankStyle(rank);
  const displayName = getDisplayName(entry);
  // Use local score if it's higher (not yet synced to server)
  const displayScore = isCurrentUser ? Math.max(localScore ?? 0, score ?? 0) : score;

  return (
    <div
      className={cn('flex items-center rounded-xl', isCurrentUser ? 'bg-blue-500 shadow-md' : row)}
      style={{gap: '4px', padding: '6px'}}
    >
      {/* Rank */}
      <div
        className={cn(
          'rounded-lg flex items-center justify-center shrink-0 font-bold',
          isCurrentUser ? 'bg-white/20 text-white' : badge
        )}
        style={{width: '32px', height: '32px', fontSize: '12px'}}
      >
        {rank}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p
          className={cn('font-semibold truncate', isCurrentUser ? 'text-white' : 'text-gray-900')}
          style={{fontSize: '14px'}}
        >
          {displayName}
        </p>
        {isCurrentUser && (
          <p className="text-white/70" style={{fontSize: '11px'}}>
            You
          </p>
        )}
      </div>

      {/* Score */}
      <div
        className={cn('font-bold tabular-nums shrink-0', isCurrentUser ? 'text-white' : 'text-gray-900')}
        style={{fontSize: '14px'}}
      >
        {formatScore(displayScore)}
      </div>
    </div>
  );
}

export function Leaderboard({entries, currentUserTelegramId, localScore}: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow border border-gray-200 text-center" style={{padding: '24px'}}>
        <p className="text-gray-400" style={{fontSize: '14px'}}>
          No players yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200" style={{padding: '8px'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
        {entries.map(entry => {
          const isCurrentUser = entry.telegramId === currentUserTelegramId;
          return (
            <LeaderboardRow
              key={entry.telegramId}
              entry={entry}
              isCurrentUser={isCurrentUser}
              localScore={isCurrentUser ? localScore : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
