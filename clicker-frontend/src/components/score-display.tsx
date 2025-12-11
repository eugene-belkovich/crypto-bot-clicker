"use client";

interface ScoreDisplayProps {
  score: number;
}

function formatScore(score: number): string {
  return score.toLocaleString("en-US");
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="text-center py-6">
      <div className="text-5xl font-bold text-[var(--tg-text,#000)]">
        {formatScore(score)}
      </div>
      <div className="text-lg text-[var(--tg-hint,#999)] mt-1">points</div>
    </div>
  );
}
