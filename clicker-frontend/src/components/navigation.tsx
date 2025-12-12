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
                'flex flex-col items-center justify-center gap-1 flex-1 py-3',
                'transition-colors touch-manipulation select-none',
                isActive ? 'text-[var(--tg-button,#3b82f6)]' : 'text-[var(--tg-hint,#999)]'
            )}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}

interface BottomNavigationProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function BottomNavigation({activeTab, onTabChange}: BottomNavigationProps) {
    return (
        <nav className="flex border-t border-[var(--tg-secondary-bg,#eee)] bg-[var(--tg-bg,#fff)]">
            <NavItem
                icon={<Gamepad2 className="w-6 h-6" />}
                label="Game"
                isActive={activeTab === 'game'}
                onClick={() => onTabChange('game')}
            />
            <NavItem
                icon={<Trophy className="w-6 h-6" />}
                label="Leaderboard"
                isActive={activeTab === 'leaderboard'}
                onClick={() => onTabChange('leaderboard')}
            />
        </nav>
    );
}
