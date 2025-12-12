'use client';

import {ScrollArea} from '@radix-ui/react-scroll-area';
import {cn} from '@/lib/utils';
import type {LeaderboardData} from '@/types';

interface LeaderboardProps {
    data: LeaderboardData;
    currentUserId?: number;
    currentUserName?: string;
}

function formatScore(score: number): string {
    return score.toLocaleString('en-US');
}

interface LeaderboardEntryRowProps {
    rank: number;
    name: string;
    score: number;
    isCurrentUser: boolean;
    isHighlighted?: boolean;
}

function LeaderboardEntryRow({rank, name, score, isCurrentUser, isHighlighted = false}: LeaderboardEntryRowProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-between p-3 rounded-lg',
                isCurrentUser || isHighlighted
                    ? 'bg-[var(--tg-button,#3b82f6)] text-white'
                    : 'bg-[var(--tg-secondary-bg,#f5f5f5)]'
            )}
        >
            <div className="flex items-center gap-3">
                <span
                    className={cn(
                        'w-8 text-center font-bold',
                        isCurrentUser || isHighlighted
                            ? 'text-white'
                            : rank <= 3
                              ? 'text-yellow-500'
                              : 'text-[var(--tg-hint,#999)]'
                    )}
                >
                    {rank}
                </span>
                <span
                    className={cn(
                        'font-medium',
                        isCurrentUser || isHighlighted ? 'text-white' : 'text-[var(--tg-text,#000)]'
                    )}
                >
                    {isCurrentUser ? `${name} (You)` : name}
                </span>
            </div>
            <span
                className={cn(
                    'font-mono',
                    isCurrentUser || isHighlighted ? 'text-white' : 'text-[var(--tg-text,#000)]'
                )}
            >
                {formatScore(score)}
            </span>
        </div>
    );
}

export function Leaderboard({data, currentUserId, currentUserName = 'You'}: LeaderboardProps) {
    const {top25, myRank, myScore} = data;

    // Check if current user is in top 25
    const isInTop25 = myRank <= 25;

    return (
        <div className="flex flex-col h-full">
            {/* My stats card at top */}
            <div className="bg-[var(--tg-button,#3b82f6)] rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center text-white">
                    <div>
                        <div className="text-sm opacity-80">Your rank</div>
                        <div className="text-2xl font-bold">#{myRank}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm opacity-80">Your score</div>
                        <div className="text-2xl font-bold">{formatScore(myScore)}</div>
                    </div>
                </div>
            </div>

            {/* Leaderboard list */}
            <ScrollArea className="flex-1 -mx-4 px-4 overflow-y-auto">
                <div className="space-y-2">
                    {top25.map(entry => {
                        const isCurrentUser = entry.oduserId === currentUserId;
                        return (
                            <LeaderboardEntryRow
                                key={entry.oduserId}
                                rank={entry.rank}
                                name={entry.name}
                                score={entry.score}
                                isCurrentUser={isCurrentUser}
                            />
                        );
                    })}

                    {/* Show current user at bottom if not in top 25 */}
                    {!isInTop25 && (
                        <>
                            {/* Separator */}
                            <div className="flex items-center gap-2 py-2">
                                <div className="flex-1 h-px bg-[var(--tg-hint,#999)] opacity-30" />
                                <span className="text-xs text-[var(--tg-hint,#999)]">Your position</span>
                                <div className="flex-1 h-px bg-[var(--tg-hint,#999)] opacity-30" />
                            </div>

                            {/* Current user outside top 25 */}
                            <LeaderboardEntryRow
                                rank={myRank}
                                name={currentUserName}
                                score={myScore}
                                isCurrentUser={false}
                                isHighlighted={true}
                            />
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
