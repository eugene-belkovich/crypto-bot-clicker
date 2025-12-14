'use client';

import {useEffect, useRef} from 'react';

const BG_FRAMES = [1, 2, 3, 4, 5, 6];
const FRAME_DURATION = 400;

interface AnimatedBackgroundProps {
    children: React.ReactNode;
}

export function AnimatedBackground({children}: AnimatedBackgroundProps) {
    const frameIndexRef = useRef(0);
    const lastFrameTimeRef = useRef(0);
    const bgRefs = useRef<(HTMLImageElement | null)[]>([]);

    useEffect(() => {
        let animationId: number;

        const animate = (timestamp: number) => {
            if (timestamp - lastFrameTimeRef.current >= FRAME_DURATION) {
                lastFrameTimeRef.current = timestamp;

                // Hide current frame
                const currentImg = bgRefs.current[frameIndexRef.current];
                if (currentImg) currentImg.style.opacity = '0';

                // Next frame
                frameIndexRef.current = (frameIndexRef.current + 1) % 6;

                // Show new frame
                const newImg = bgRefs.current[frameIndexRef.current];
                if (newImg) newImg.style.opacity = '1';
            }

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div className="relative h-full w-full overflow-hidden">
            {BG_FRAMES.map((frame, i) => (
                <img
                    key={`bg-${frame}`}
                    ref={el => {
                        bgRefs.current[i] = el;
                    }}
                    src={`/bg/${frame}.jpeg`}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-bottom"
                    style={{opacity: i === 0 ? 1 : 0}}
                    draggable={false}
                />
            ))}

            <div className="relative z-10 h-full w-full">{children}</div>
        </div>
    );
}
