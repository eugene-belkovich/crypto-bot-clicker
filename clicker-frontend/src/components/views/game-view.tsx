'use client';

import {ClickButton} from '@/components/click-button';
import {ScoreDisplay} from '@/components/score-display';

interface GameViewProps {
    score: number;
    onClick: () => void;
}

export function GameView({score, onClick}: GameViewProps) {
    return (
        <>
            <ScoreDisplay score={score} />
            <div className="flex-1 flex items-center justify-center">
                <ClickButton onClick={onClick} />
            </div>
        </>
    );
}
