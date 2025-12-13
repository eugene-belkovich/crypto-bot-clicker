'use client';

import {useState} from 'react';
import {BottomNavigation, type TabType} from '@/components/navigation';
import {GameView} from '@/components/views/game-view';
import {LeaderboardView} from '@/components/views/leaderboard-view';
import {useGame} from '@/hooks/use-game';
import {useTelegram} from '@/hooks/use-telegram';
import {cn} from '@/lib/utils';

export default function Home() {
  const {initData, user, isReady} = useTelegram();
  const {score, handleClick} = useGame(initData);
  const [activeTab, setActiveTab] = useState<TabType>('game');

  if (!isReady) {
    return (
      <div className={cn('flex h-screen items-center justify-center', 'bg-[#0a0a0f]')}>
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              'w-8 h-8 sm:w-10 sm:h-10',
              'border-3 border-blue-500 border-t-transparent',
              'rounded-full animate-spin'
            )}
          />
          <span className="text-sm sm:text-base text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {activeTab === 'game' ? (
        <GameView score={score} onClick={handleClick} />
      ) : (
        <LeaderboardView
          initData={initData}
          visitorTelegramId={user?.id}
          username={user?.username || user?.first_name}
          userPhoto={user?.photo_url}
          localScore={score}
        />
      )}

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
