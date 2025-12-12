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
    <div className={cn('text-center', 'py-6 sm:py-8 md:py-10 lg:py-12', 'px-4')}>
      <div
        className={cn(
          'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
          'font-bold',
          'text-[var(--tg-text,#000)]',
          'tracking-tight',
          'transition-transform duration-100'
        )}
      >
        {formatScore(score)}
      </div>
      <div
        className={cn(
          'text-base sm:text-lg md:text-xl',
          'text-[var(--tg-hint,#999)]',
          'mt-1 sm:mt-2',
          'font-medium',
          'uppercase tracking-widest'
        )}
      >
        points
      </div>
    </div>
  );
}
