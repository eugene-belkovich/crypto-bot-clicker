'use client';

import {ClickButton} from '@/components/click-button';
import {ScoreDisplay} from '@/components/score-display';
import {cn} from '@/lib/utils';

interface GameViewProps {
    score: number;
    onClick: () => void;
}

export function GameView({score, onClick}: GameViewProps) {
    return (
        <div
            className={cn(
                'flex-1 flex flex-col',
                'min-h-0'
            )}
        >
            <div className="shrink-0">
                <ScoreDisplay score={score} />
            </div>

            <div
                className={cn(
                    'flex-1 flex items-center justify-center',
                    'px-4 pb-4 sm:pb-6 md:pb-8'
                )}
            >
                <ClickButton onClick={onClick} />
            </div>
        </div>
    );
}
