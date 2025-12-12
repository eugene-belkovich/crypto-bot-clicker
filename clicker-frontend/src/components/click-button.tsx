'use client';

import {useState} from 'react';
import {cn} from '@/lib/utils';

interface ClickButtonProps {
  onClick: (x: number, y: number) => void;
}

export function ClickButton({onClick}: ClickButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    onClick(x, y);
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        'w-48 h-48 rounded-full',
        'bg-gradient-to-b from-blue-500 to-blue-600',
        'shadow-[0_8px_0_0_#1e40af,0_12px_20px_rgba(0,0,0,0.3)]',
        'active:shadow-[0_4px_0_0_#1e40af,0_6px_10px_rgba(0,0,0,0.3)]',
        'transition-all duration-75 ease-out',
        'select-none touch-manipulation',
        'flex items-center justify-center',
        isPressed && 'translate-y-1 scale-95'
      )}
    >
      <span className="text-5xl font-bold text-white drop-shadow-md">TAP</span>
    </button>
  );
}
