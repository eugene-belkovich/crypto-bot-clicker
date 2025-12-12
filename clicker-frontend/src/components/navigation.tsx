"use client";

import { ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function NavButton({ href, children, className }: NavButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-center gap-2",
        "px-6 py-3 rounded-full",
        "bg-[var(--tg-button,#3b82f6)] text-[var(--tg-button-text,#fff)]",
        "font-medium transition-transform active:scale-95",
        "touch-manipulation select-none",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function LeaderboardButton() {
  return (
    <NavButton href="/leaderboard">
      <Trophy className="w-5 h-5" />
      <span>Leaderboard</span>
    </NavButton>
  );
}

export function BackButton() {
  return (
    <NavButton href="/" className="w-auto px-4">
      <ArrowLeft className="w-5 h-5" />
      <span>Back</span>
    </NavButton>
  );
}
