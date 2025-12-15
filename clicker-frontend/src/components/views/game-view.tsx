'use client';

import type {PointerEvent} from 'react';
import {useCallback, useRef, useState} from 'react';
import {AnimatedBackground} from '@/components/animated-background';
import {AnimatedCharacter, type AnimatedCharacterRef} from '@/components/animated-character';
import {ScoreDisplay} from '@/components/score-display';
import {SparkEffect, useSparkEffect} from '@/components/spark-effect';

interface GameViewProps {
  score: number;
  onClick: (x: number, y: number) => void;
}

export function GameView({score, onClick}: GameViewProps) {
  const [isBouncing, setIsBouncing] = useState(false);
  const characterRef = useRef<AnimatedCharacterRef>(null);
  const {effects, addEffect} = useSparkEffect();

  const triggerBounce = useCallback(() => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 80);
  }, []);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    onClick(e.clientX, e.clientY);
    addEffect(e.clientX, e.clientY);
    triggerBounce();
    characterRef.current?.triggerClick();
  };

  return (
    <AnimatedBackground>
      <div
        role="button"
        tabIndex={0}
        className="h-full w-full flex items-center justify-center select-none relative"
        style={{touchAction: 'manipulation'}}
        onPointerDown={handlePointerDown}
        onKeyDown={e => e.key === 'Enter' && onClick(0, 0)}
      >
        {/* Bottom fade overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '200px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          }}
        />

        <div style={{position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)', zIndex: 10}}>
          <ScoreDisplay score={score} />
        </div>

        <div
          className="coin-container"
          style={{
            transform: isBouncing ? 'scale(0.95) translateY(6px)' : 'scale(1) translateY(0)',
            transition: 'transform 0.08s ease-out',
          }}
        >
          <AnimatedCharacter ref={characterRef} />
        </div>

        <SparkEffect effects={effects} />
      </div>
    </AnimatedBackground>
  );
}
