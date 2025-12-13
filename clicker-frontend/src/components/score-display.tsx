'use client';

import {cn} from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
}

function formatScore(score: number): string {
  return score.toLocaleString('en-US');
}

export function ScoreDisplay({score}: ScoreDisplayProps) {
  return (
    <div className="text-center">
      <div
        className={cn('font-bold', 'text-[var(--tg-text,#000)]', 'tracking-tight', 'transition-transform duration-100')}
        style={{fontSize: '48px'}}
      >
        {formatScore(score)}
      </div>
      <div
        className={cn('text-[var(--tg-hint,#999)]', 'font-medium', 'uppercase tracking-widest')}
        style={{fontSize: '14px', marginTop: '4px'}}
      >
        points
      </div>
    </div>
  );
}
