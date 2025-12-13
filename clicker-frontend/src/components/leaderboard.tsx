'use client';

import {cn} from '@/lib/utils';
import type {LeaderboardEntry} from '@/types';

interface LeaderboardProps {
    entries: LeaderboardEntry[];
    currentUserTelegramId?: string;
    localScore?: number;
}

function formatScore(score: number | undefined): string {
    const value = score ?? 0;
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString('en-US');
}

function getDisplayName(entry: LeaderboardEntry): string {
    return entry.username || entry.firstName || 'Anonymous';
}

function getRankStyle(rank: number): { badge: string; row: string } {
    if (rank === 1) {
        return {
            badge: 'bg-gradient-to-br from-yellow-400 to-amber-500',
            row: 'bg-yellow-500/20'
        };
    }
    if (rank === 2) {
        return {
            badge: 'bg-gradient-to-br from-gray-300 to-gray-400',
            row: 'bg-white/10'
        };
    }
    if (rank === 3) {
        return {
            badge: 'bg-gradient-to-br from-orange-400 to-orange-500',
            row: 'bg-orange-500/20'
        };
    }
    return {
        badge: 'bg-white/20',
        row: 'bg-white/5'
    };
}

function getRankDisplay(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return String(rank);
}

interface LeaderboardRowProps {
    entry: LeaderboardEntry;
    isCurrentUser: boolean;
    localScore?: number;
}

function LeaderboardRow({entry, isCurrentUser, localScore}: LeaderboardRowProps) {
    const {rank, score} = entry;
    const {badge, row} = getRankStyle(rank);
    const displayName = getDisplayName(entry);
    // Use local score if it's higher (not yet synced to server)
    const displayScore = isCurrentUser ? Math.max(localScore ?? 0, score ?? 0) : score;
    const isTopThree = rank <= 3;

    return (
        <div
            className={cn('flex items-center rounded-xl', row)}
            style={{gap: '8px', padding: '4px 6px'}}
        >
            {/* Rank */}
            <div
                className={cn(
                    'rounded-lg flex items-center justify-center shrink-0 font-bold',
                    isTopThree ? '' : badge + ' text-white'
                )}
                style={{width: '32px', height: '32px', fontSize: isTopThree ? '20px' : '13px'}}
            >
                {getRankDisplay(rank)}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
                <p
                    className={cn('font-semibold truncate text-white drop-shadow-sm')}
                    style={{fontSize: '15px'}}
                >
                    {displayName}
                </p>
                {isCurrentUser && (
                    <p className="text-white/70" style={{fontSize: '11px'}}>
                        You
                    </p>
                )}
            </div>

            {/* Score */}
            <div
                className="font-bold tabular-nums shrink-0 bg-black/40 text-white rounded-lg"
                style={{fontSize: '14px', padding: '4px 10px'}}
            >
                {formatScore(displayScore)}
            </div>
        </div>
    );
}

export function Leaderboard({entries, currentUserTelegramId, localScore}: LeaderboardProps) {
    if (entries.length === 0) {
        return (
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl text-center" style={{padding: '24px'}}>
                <p className="text-white/60" style={{fontSize: '14px'}}>
                    No players yet
                </p>
            </div>
        );
    }

    return (
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl" style={{padding: '8px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                {entries.map(entry => {
                    const isCurrentUser = entry.telegramId === currentUserTelegramId;
                    return (
                        <LeaderboardRow
                            key={entry.telegramId}
                            entry={entry}
                            isCurrentUser={isCurrentUser}
                            localScore={isCurrentUser ? localScore : undefined}
                        />
                    );
                })}
            </div>
        </div>
    );
}
