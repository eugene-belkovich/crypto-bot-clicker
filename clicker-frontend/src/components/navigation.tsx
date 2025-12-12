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
        'flex flex-col items-center justify-center gap-1',
        'flex-1 py-2',
        'transition-all duration-200',
        'touch-manipulation select-none',
        isActive ? 'text-blue-500' : 'text-gray-400'
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center',
          'transition-all duration-200',
          isActive ? 'bg-blue-50' : 'bg-transparent'
        )}
      >
        <div className="w-6 h-6">{icon}</div>
      </div>
      <span className={cn('text-xs font-medium', isActive ? 'text-blue-500' : 'text-gray-400')}>{label}</span>
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
      className="bg-white border-t border-gray-100 shrink-0"
      style={{paddingBottom: 'env(safe-area-inset-bottom, 0px)'}}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
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
