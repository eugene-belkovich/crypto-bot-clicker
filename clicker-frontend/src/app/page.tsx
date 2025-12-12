'use client';

import {useState} from 'react';
import {GameView} from '@/components/views/game-view';
import {LeaderboardView} from '@/components/views/leaderboard-view';
import {BottomNavigation, type TabType} from '@/components/navigation';
import {useGame} from '@/hooks/use-game';
import {useTelegram} from '@/hooks/use-telegram';

export default function Home() {
    const {initData, user, isReady} = useTelegram();
    const {score, handleClick} = useGame(initData);
    const [activeTab, setActiveTab] = useState<TabType>('game');

    if (!isReady) {
        return (
            <div className="flex h-screen items-center justify-center bg-[var(--tg-bg,#fff)]">
                <div className="text-[var(--tg-hint,#999)]">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[var(--tg-bg,#fff)]">
            {activeTab === 'game' ? (
                <GameView score={score} onClick={handleClick} />
            ) : (
                <LeaderboardView initData={initData} userId={user?.id} userName={user?.first_name} />
            )}

            <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}
