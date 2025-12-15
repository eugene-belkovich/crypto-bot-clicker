'use client';

import {useCallback, useState} from 'react';

interface Spark {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  duration: number;
  hue: number;
}

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  sparks: Spark[];
}

let effectId = 0;

function generateSparks(): Spark[] {
  const sparkCount = 12 + Math.floor(Math.random() * 8);
  return Array.from({length: sparkCount}, (_, i) => ({
    id: i,
    angle: Math.random() * 360,
    distance: 60 + Math.random() * 100,
    size: 8 + Math.random() * 12,
    delay: Math.random() * 0.15,
    duration: 0.5 + Math.random() * 0.4,
    hue: 30 + Math.random() * 30,
  }));
}

export function useSparkEffect() {
  const [effects, setEffects] = useState<ClickEffect[]>([]);

  const addEffect = useCallback((x: number, y: number) => {
    const id = effectId++;
    const sparks = generateSparks();
    setEffects(prev => [...prev, {id, x, y, sparks}]);
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== id));
    }, 800);
  }, []);

  return {effects, addEffect};
}

interface SparkEffectProps {
  effects: ClickEffect[];
}

export function SparkEffect({effects}: SparkEffectProps) {
  return (
    <>
      {effects.map(effect => (
        <div
          key={effect.id}
          className="spark-container"
          style={{
            position: 'fixed',
            left: effect.x,
            top: effect.y,
            pointerEvents: 'none',
            zIndex: 50,
          }}
        >
          <div className="flash-burst" />
          <div className="click-text">+1</div>
          {effect.sparks.map(spark => (
            <div
              key={spark.id}
              className="spark"
              style={
                {
                  '--spark-angle': `${spark.angle}deg`,
                  '--spark-distance': `${spark.distance}px`,
                  '--spark-size': `${spark.size}px`,
                  '--spark-delay': `${spark.delay}s`,
                  '--spark-duration': `${spark.duration}s`,
                  '--spark-hue': spark.hue,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}

      <style jsx>{`
        .flash-burst {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 215, 0, 0.6) 30%,
            rgba(255, 140, 0, 0.3) 60%,
            transparent 70%
          );
          transform: translate(-50%, -50%);
          animation: flashPulse 0.3s ease-out forwards;
        }

        @keyframes flashPulse {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.2);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
          }
        }

        .click-text {
          font-size: 42px;
          font-weight: 900;
          color: #fff;
          text-shadow:
            0 0 20px rgba(255, 215, 0, 1),
            0 0 40px rgba(255, 180, 0, 0.8),
            0 0 60px rgba(255, 140, 0, 0.6),
            0 2px 4px rgba(0, 0, 0, 0.5);
          animation: floatUp 0.7s ease-out forwards;
          transform: translate(-50%, -50%);
        }

        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
          }
          20% {
            transform: translate(-50%, -60%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -120%) scale(1.4);
          }
        }

        .spark {
          position: absolute;
          width: var(--spark-size);
          height: var(--spark-size);
          background: radial-gradient(
            circle,
            #fff 0%,
            hsl(var(--spark-hue), 100%, 70%) 20%,
            hsl(var(--spark-hue), 100%, 50%) 50%,
            transparent 70%
          );
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: sparkBurst var(--spark-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--spark-delay) forwards;
          box-shadow:
            0 0 8px 2px hsl(var(--spark-hue), 100%, 70%),
            0 0 16px 4px hsl(var(--spark-hue), 100%, 60%),
            0 0 24px 6px hsl(var(--spark-hue), 100%, 50%);
        }

        @keyframes sparkBurst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--spark-angle)) translateY(0) scale(1.5);
            filter: brightness(1.5);
          }
          30% {
            opacity: 1;
            filter: brightness(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--spark-angle)) translateY(calc(-1 * var(--spark-distance))) scale(0.2);
            filter: brightness(0.8);
          }
        }
      `}</style>
    </>
  );
}
