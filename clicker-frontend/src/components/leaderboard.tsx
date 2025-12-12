'use client';

import {cn} from '@/lib/utils';
import type {LeaderboardData} from '@/types';

interface LeaderboardProps {
  data: LeaderboardData;
  currentUserId?: number;
  currentUserName?: string;
}

function formatScore(score: number): string {
  if (score >= 1000000) {
    return `${(score / 1000000).toFixed(1)}M`;
  }
  if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}K`;
  }
  return score.toLocaleString('en-US');
}

interface LeaderboardEntryRowProps {
  rank: number;
  name: string;
  score: number;
  isCurrentUser: boolean;
  isHighlighted?: boolean;
}

function getRankDisplay(rank: number): {icon: string | null; bgColor: string; textColor: string} {
  if (rank === 1) return {icon: '🥇', bgColor: 'bg-amber-50', textColor: 'text-amber-600'};
  if (rank === 2) return {icon: '🥈', bgColor: 'bg-slate-100', textColor: 'text-slate-500'};
  if (rank === 3) return {icon: '🥉', bgColor: 'bg-orange-50', textColor: 'text-orange-600'};
  return {icon: null, bgColor: 'bg-gray-50', textColor: 'text-gray-500'};
}

function LeaderboardEntryRow({rank, name, score, isCurrentUser, isHighlighted = false}: LeaderboardEntryRowProps) {
  const {icon, bgColor, textColor} = getRankDisplay(rank);
  const isActive = isCurrentUser || isHighlighted;

  return (
    <div
      className={cn('flex items-center', 'py-3 rounded-2xl', isActive ? 'bg-blue-500' : bgColor)}
      style={{paddingLeft: 16, paddingRight: 16}}
    >
      {/* Rank badge */}
      <div
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mr-3',
          isActive ? 'bg-white/20 text-white' : `bg-white shadow-sm ${textColor}`
        )}
      >
        {icon || rank}
      </div>

      <div className="flex-1 min-w-0 mr-3">
        <p className={cn('font-semibold truncate', isActive ? 'text-white' : 'text-gray-900')}>{name}</p>
        {isCurrentUser && <p className="text-xs text-white/70">You</p>}
      </div>

      <div className={cn('font-bold tabular-nums', isActive ? 'text-white' : 'text-gray-900')}>
        {formatScore(score)}
      </div>
    </div>
  );
}

export function Leaderboard({data, currentUserId, currentUserName = 'You'}: LeaderboardProps) {
  const {top25, myRank, myScore} = data;
  const isInTop25 = myRank <= 25;

  return (
    <div className="flex flex-col h-full" style={{padding: '0 16px'}}>
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 mb-5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-blue-100 text-sm font-medium mb-1">Your Rank</p>
            <p className="text-white text-3xl font-bold">#{myRank}</p>
          </div>
          <div className="w-px h-12 bg-white/20 mx-4 shrink-0" />
          <div className="flex-1 text-right">
            <p className="text-blue-100 text-sm font-medium mb-1">Your Score</p>
            <p className="text-white text-3xl font-bold tabular-nums">{formatScore(myScore)}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0" style={{margin: '0 -16px', padding: '0 16px'}}>
        <div className="flex flex-col gap-3 pb-4">
          {top25.map(entry => {
            const isCurrentUser = entry.userId === currentUserId;
            return (
              <LeaderboardEntryRow
                key={entry.userId}
                rank={entry.rank}
                name={entry.name}
                score={entry.score}
                isCurrentUser={isCurrentUser}
              />
            );
          })}

          {!isInTop25 && (
            <>
              <div className="flex items-center gap-3 py-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">Your position</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <LeaderboardEntryRow
                rank={myRank}
                name={currentUserName}
                score={myScore}
                isCurrentUser={false}
                isHighlighted={true}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
