'use client';

import {useEffect} from 'react';
import {Leaderboard} from '@/components/leaderboard';
import {UserRankCard} from '@/components/user-rank-card';
import {useLeaderboardStore} from '@/store/leaderboard';

interface LeaderboardViewProps {
  initData: string;
  visitorTelegramId?: number;
  username?: string;
  userPhoto?: string;
  localScore?: number;
}

export function LeaderboardView({initData, visitorTelegramId, username, userPhoto, localScore}: LeaderboardViewProps) {
  const {data, isLoading, error, init, cleanup} = useLeaderboardStore();

  useEffect(() => {
    init(initData);
    return () => cleanup();
  }, [initData, init, cleanup]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{margin: '0 16px'}}>
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const me = data.me;
  const displayUsername = me?.username || username || me?.firstName || 'Player';
  // Use local score if it's higher (not yet synced to server)
  const displayScore = Math.max(localScore ?? 0, me?.score ?? 0);

  return (
    <div className="flex-1 overflow-y-auto" style={{padding: '16px'}}>
      <UserRankCard username={displayUsername} photoUrl={userPhoto} rank={me?.rank ?? 0} score={displayScore} />

      <h2 style={{textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#111', margin: '16px 0 12px'}}>
        Top 25
      </h2>

      <Leaderboard
        entries={data.leaderboard ?? []}
        currentUserTelegramId={visitorTelegramId ? String(visitorTelegramId) : undefined}
        localScore={localScore}
      />
    </div>
  );
}
