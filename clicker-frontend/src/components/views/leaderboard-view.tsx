'use client';

import {Trophy} from 'lucide-react';
import {Leaderboard} from '@/components/leaderboard';
import {useLeaderboard} from '@/hooks/use-leaderboard';

interface LeaderboardViewProps {
    initData: string;
    userId?: number;
    userName?: string;
}

export function LeaderboardView({initData, userId, userName}: LeaderboardViewProps) {
    const {data, isLoading, error} = useLeaderboard(initData);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-[var(--tg-hint,#999)]">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <>
                <header className="flex items-center justify-center gap-2 p-4 border-b border-[var(--tg-secondary-bg,#eee)]">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h1 className="text-xl font-bold text-[var(--tg-text,#000)]">Leaderboard</h1>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-500">{error}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="flex items-center justify-center gap-2 p-4 border-b border-[var(--tg-secondary-bg,#eee)]">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h1 className="text-xl font-bold text-[var(--tg-text,#000)]">Top Players</h1>
            </header>
            <main className="flex-1 overflow-hidden p-4">
                {data && <Leaderboard data={data} currentUserId={userId} currentUserName={userName} />}
            </main>
        </>
    );
}
