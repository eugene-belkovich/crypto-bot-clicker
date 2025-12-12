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
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col p-6">
                <header className="flex items-center justify-center gap-2 py-3 shrink-0">
                    <Trophy className="w-6 h-6 text-amber-500" />
                    <h1 className="text-xl font-bold text-gray-900">Leaderboard</h1>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-500 text-center">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <header className="flex items-center justify-center gap-2 py-3 shrink-0">
                <Trophy className="w-6 h-6 text-amber-500" />
                <h1 className="text-xl font-bold text-gray-900">Leaderboard</h1>
            </header>

            <main className="flex-1 overflow-hidden min-h-0">
                {data && <Leaderboard data={data} currentUserId={userId} currentUserName={userName} />}
            </main>
        </div>
    );
}
