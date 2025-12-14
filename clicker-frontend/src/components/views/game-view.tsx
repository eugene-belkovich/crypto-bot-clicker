'use client';

import type {PointerEvent} from 'react';
import {useCallback, useRef, useState} from 'react';
import {AnimatedBackground} from '@/components/animated-background';
import {AnimatedCharacter, type AnimatedCharacterRef} from '@/components/animated-character';
import {ScoreDisplay} from '@/components/score-display';

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

interface GameViewProps {
  score: number;
  onClick: (x: number, y: number) => void;
}

let effectId = 0;

export function GameView({score, onClick}: GameViewProps) {
  const [effects, setEffects] = useState<ClickEffect[]>([]);
  const [isBouncing, setIsBouncing] = useState(false);
  const characterRef = useRef<AnimatedCharacterRef>(null);

  const addEffect = useCallback((x: number, y: number) => {
    const id = effectId++;
    setEffects(prev => [...prev, {id, x, y}]);
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== id));
    }, 600);
  }, []);

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
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
          }}
        />

        <div style={{position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)', zIndex: 10}}>
          <ScoreDisplay score={score} />
        </div>

        <div
          className="coin-container"
          style={{
            transform: isBouncing ? 'scale(0.95) translateY(6px)' : 'scale(1) translateY(0)',
            transition: 'transform 0.08s ease-out'
          }}
        >
          <AnimatedCharacter ref={characterRef} />
        </div>

        {effects.map(effect => (
          <div
            key={effect.id}
            className="click-effect"
            style={{
              position: 'fixed',
              left: effect.x,
              top: effect.y,
              pointerEvents: 'none',
              zIndex: 50
            }}
          >
            +1
          </div>
        ))}

        <style jsx>{`
          .click-effect {
            font-size: 32px;
            font-weight: bold;
            color: #fcd34d;
            text-shadow: 0 0 12px rgba(252, 211, 77, 0.8), 0 2px 4px rgba(0, 0, 0, 0.3);
            animation: floatUp 0.6s ease-out forwards;
            transform: translate(-50%, -50%);
          }

          @keyframes floatUp {
            0% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -100%) scale(1.3);
            }
          }
        `}</style>
      </div>
    </AnimatedBackground>
  );
}
