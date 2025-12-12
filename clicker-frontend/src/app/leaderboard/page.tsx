'use client';

import {Trophy} from 'lucide-react';
import {Leaderboard} from '@/components/leaderboard';
import {BackButton} from '@/components/navigation';
import {useLeaderboard} from '@/hooks/use-leaderboard';
import {useTelegram} from '@/hooks/use-telegram';

export default function LeaderboardPage() {
    const {initData, user, isReady} = useTelegram();
    const {data, isLoading, error} = useLeaderboard(initData);

    if (!isReady || isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[var(--tg-bg,#fff)]">
                <div className="text-[var(--tg-hint,#999)]">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen flex-col bg-[var(--tg-bg,#fff)]">
                <header className="flex items-center gap-4 p-4 border-b border-[var(--tg-secondary-bg,#eee)]">
                    <BackButton />
                    <h1 className="text-xl font-bold text-[var(--tg-text,#000)]">Leaderboard</h1>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-[var(--tg-bg,#fff)]">
            {/* Header */}
            <header className="flex items-center gap-4 p-4 border-b border-[var(--tg-secondary-bg,#eee)]">
                <BackButton />
                <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h1 className="text-xl font-bold text-[var(--tg-text,#000)]">Top Players</h1>
                </div>
            </header>

            {/* Leaderboard */}
            <main className="flex-1 overflow-hidden p-4">
                {data && <Leaderboard data={data} currentUserId={user?.id} currentUserName={user?.first_name} />}
            </main>
        </div>
    );
}
