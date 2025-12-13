'use client';

import {ClickButton} from '@/components/click-button';
import {ScoreDisplay} from '@/components/score-display';

interface GameViewProps {
  score: number;
  onClick: (x: number, y: number) => void;
}

export function GameView({score, onClick}: GameViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center" style={{gap: '24px', padding: '16px'}}>
      <ScoreDisplay score={score} />
      <ClickButton onClick={onClick} />
    </div>
  );
}
