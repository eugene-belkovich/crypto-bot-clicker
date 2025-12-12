"use client";

import {ScrollArea} from "@radix-ui/react-scroll-area";
import {cn} from "@/lib/utils";
import type {LeaderboardData} from "@/types";

interface LeaderboardProps {
    data: LeaderboardData;
    currentUserId?: number;
}

function formatScore(score: number): string {
    return score.toLocaleString("en-US");
}

export function Leaderboard({data, currentUserId}: LeaderboardProps) {
    const {top25, myRank, myScore} = data;

    return (
        <div className="flex flex-col h-full">
            <div className="bg-[var(--tg-secondary-bg,#f5f5f5)] rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-sm text-[var(--tg-hint,#999)]">Your rank</div>
                        <div className="text-2xl font-bold text-[var(--tg-text,#000)]">
                            #{myRank}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-[var(--tg-hint,#999)]">Your score</div>
                        <div className="text-2xl font-bold text-[var(--tg-text,#000)]">
                            {formatScore(myScore)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard list */}
            <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="space-y-2">
                    {top25.map((entry) => {
                        const isCurrentUser = entry.oduserId === currentUserId;
                        return (
                            <div
                                key={entry.oduserId}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-lg",
                                    isCurrentUser
                                        ? "bg-blue-100 dark:bg-blue-900/30"
                                        : "bg-[var(--tg-secondary-bg,#f5f5f5)]",
                                )}
                            >
                                <div className="flex items-center gap-3">
                  <span
                      className={cn(
                          "w-8 text-center font-bold",
                          entry.rank <= 3
                              ? "text-yellow-500"
                              : "text-[var(--tg-hint,#999)]",
                      )}
                  >
                    {entry.rank}
                  </span>
                                    <span className="font-medium text-[var(--tg-text,#000)]">
                    {entry.name}
                  </span>
                                </div>
                                <span className="font-mono text-[var(--tg-text,#000)]">
                  {formatScore(entry.score)}
                </span>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
