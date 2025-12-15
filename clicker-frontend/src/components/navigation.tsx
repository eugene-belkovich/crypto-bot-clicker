'use client';

import {Gamepad2, Trophy} from 'lucide-react';
import {cn} from '@/lib/utils';

export type TabType = 'game' | 'leaderboard';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({icon, label, isActive, onClick}: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center',
        'transition-all duration-200',
        'touch-manipulation select-none',
        'pointer-events-auto',
      )}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center',
          'transition-all duration-200',
          'shadow-lg',
          isActive ? 'bg-gradient-to-b from-yellow-400 to-orange-500' : 'bg-white/90 backdrop-blur-sm',
        )}
      >
        <div className={cn('w-8 h-8', isActive ? 'text-white' : 'text-gray-600')}>{icon}</div>
      </div>
      <span className={cn('text-xs font-semibold mt-1', isActive ? 'text-white' : 'text-white/70')}>{label}</span>
    </button>
  );
}

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNavigation({activeTab, onTabChange}: BottomNavigationProps) {
  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none"
      style={{paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)'}}
    >
      <div className="flex items-end justify-center gap-6 w-full pointer-events-none">
        <NavItem
          icon={<Gamepad2 className="w-full h-full" />}
          label="Game"
          isActive={activeTab === 'game'}
          onClick={() => onTabChange('game')}
        />
        <NavItem
          icon={<Trophy className="w-full h-full" />}
          label="Leaderboard"
          isActive={activeTab === 'leaderboard'}
          onClick={() => onTabChange('leaderboard')}
        />
      </div>
    </nav>
  );
}
