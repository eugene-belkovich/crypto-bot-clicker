"use client";

import {ClickButton} from "@/components/click-button";
import {ScoreDisplay} from "@/components/score-display";
import {useGame} from "@/hooks/use-game";
import {useTelegram} from "@/hooks/use-telegram";

export default function Home() {
    const {initData, isReady} = useTelegram();
    const {score, handleClick} = useGame(initData);

    if (!isReady) {
        return (
            <div className="flex h-screen items-center justify-center bg-[var(--tg-bg,#fff)]">
                <div className="text-[var(--tg-hint,#999)]">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[var(--tg-bg,#fff)]">
            <ScoreDisplay score={score} />

            <div className="flex-1 flex items-center justify-center">
                <ClickButton onClick={handleClick} />
            </div>
        </div>
    );
}
