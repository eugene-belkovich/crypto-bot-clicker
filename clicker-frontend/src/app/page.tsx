'use client';

import {useCallback, useState} from 'react';
import {BottomNavigation, type TabType} from '@/components/navigation';
import {BanView} from '@/components/views/ban-view';
import {GameView} from '@/components/views/game-view';
import {LeaderboardView} from '@/components/views/leaderboard-view';
import {MobileOnlyView} from '@/components/views/mobile-only-view';
import {useGame} from '@/hooks/use-game';
import {useTelegram} from '@/hooks/use-telegram';
import {config} from '@/lib/config';
import {cn} from '@/lib/utils';

export default function Home() {
  const {initData, user, isReady, platform, isMobile} = useTelegram();
  const {score, handleClick, flushClicks, isBanned, banReason, isLoaded} = useGame(initData);
  const [activeTab, setActiveTab] = useState<TabType>('game');

  const handleTabChange = useCallback(
    async (tab: TabType) => {
      if (tab === 'leaderboard') {
        await flushClicks();
      }
      setActiveTab(tab);
    },
    [flushClicks],
  );

  if (!isReady || !isLoaded) {
    return (
      <div className={cn('flex h-screen items-center justify-center', 'bg-[#0a0a0f]')}>
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              'w-8 h-8 sm:w-10 sm:h-10',
              'border-3 border-blue-500 border-t-transparent',
              'rounded-full animate-spin',
            )}
          />
          <span className="text-sm sm:text-base text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (config.platformLock && !isMobile) {
    return <MobileOnlyView platform={platform} botUrl={config.botUrl} />;
  }

  if (isBanned) {
    return <BanView reason={banReason} />;
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

      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
