'use client';

import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef} from 'react';

const FRAMES = [1, 2, 3, 4, 5, 6];
const FRAME_DURATION = 250; // ms per frame (slower, was 150)
const CLICK_FRAME = 4;
const CLICK_FRAME_DURATION = 80;

// 4 animation variants
type AnimationVariant = 'blink' | 'blink-reverse' | 'look' | 'look-reverse';

const ANIMATION_VARIANTS: AnimationVariant[] = ['blink', 'blink-reverse', 'look', 'look-reverse'];

function getRandomVariant(current: AnimationVariant): AnimationVariant {
  const available = ANIMATION_VARIANTS.filter(v => v !== current);
  return available[Math.floor(Math.random() * available.length)];
}

function getFrameSequence(variant: AnimationVariant): number[] {
  const isReverse = variant.includes('reverse');
  return isReverse ? [5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5];
}

function getAnimationType(variant: AnimationVariant): 'blink' | 'look' {
  return variant.startsWith('blink') ? 'blink' : 'look';
}

export interface AnimatedCharacterRef {
  triggerClick: () => void;
}

export const AnimatedCharacter = forwardRef<AnimatedCharacterRef>(function AnimatedCharacter(_, ref) {
  const frameIndexRef = useRef(0);
  const currentVariantRef = useRef<AnimationVariant>('blink');
  const frameSequenceRef = useRef(getFrameSequence('blink'));
  const isClickedRef = useRef(false);
  const lastFrameTimeRef = useRef(0);

  const blinkRefs = useRef<(HTMLImageElement | null)[]>([]);
  const lookRefs = useRef<(HTMLImageElement | null)[]>([]);

  const getRefs = useCallback((type: 'blink' | 'look') => {
    return type === 'blink' ? blinkRefs : lookRefs;
  }, []);

  useEffect(() => {
    let animationId: number;

    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTimeRef.current >= FRAME_DURATION) {
        lastFrameTimeRef.current = timestamp;

        if (!isClickedRef.current) {
          const currentType = getAnimationType(currentVariantRef.current);
          const currentRefs = getRefs(currentType);
          const sequence = frameSequenceRef.current;

          // Hide current frame
          const currentFrameIdx = sequence[frameIndexRef.current];
          const currentImg = currentRefs.current[currentFrameIdx];
          if (currentImg) currentImg.style.opacity = '0';

          // Next frame
          frameIndexRef.current++;

          if (frameIndexRef.current >= 6) {
            // Switch to random variant
            frameIndexRef.current = 0;
            const newVariant = getRandomVariant(currentVariantRef.current);
            currentVariantRef.current = newVariant;
            frameSequenceRef.current = getFrameSequence(newVariant);
          }

          // Show new frame
          const newType = getAnimationType(currentVariantRef.current);
          const newRefs = getRefs(newType);
          const newSequence = frameSequenceRef.current;
          const newFrameIdx = newSequence[frameIndexRef.current];
          const newImg = newRefs.current[newFrameIdx];
          if (newImg) newImg.style.opacity = '1';
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [getRefs]);

  const triggerClick = useCallback(() => {
    if (isClickedRef.current) return;

    isClickedRef.current = true;

    // Hide all, show only click frame
    blinkRefs.current.forEach((img, i) => {
      if (img) img.style.opacity = i === CLICK_FRAME - 1 ? '1' : '0';
    });
    lookRefs.current.forEach(img => {
      if (img) img.style.opacity = '0';
    });

    setTimeout(() => {
      isClickedRef.current = false;
    }, CLICK_FRAME_DURATION);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      triggerClick,
    }),
    [triggerClick],
  );

  return (
    <div className="relative drop-shadow-2xl" style={{width: '130vw', maxWidth: '567px', aspectRatio: '9/16'}}>
      {FRAMES.map((frame, i) => (
        <img
          key={`blink-${frame}`}
          ref={el => {
            blinkRefs.current[i] = el;
          }}
          src={`/coin/blink/${frame}.png`}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{opacity: i === 0 ? 1 : 0}}
          draggable={false}
        />
      ))}

      {FRAMES.map((frame, i) => (
        <img
          key={`look-${frame}`}
          ref={el => {
            lookRefs.current[i] = el;
          }}
          src={`/coin/look/${frame}.png`}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{opacity: 0}}
          draggable={false}
        />
      ))}
    </div>
  );
});
