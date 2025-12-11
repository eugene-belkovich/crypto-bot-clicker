"use client";

import {ClickButton} from "@/components/click-button";
import {useTelegram} from "@/hooks/use-telegram";

export default function Home() {
    const {initData, isReady} = useTelegram();

    if (!isReady) {
        return (
            <div className="flex h-screen items-center justify-center bg-[var(--tg-bg,#fff)]">
                <div className="text-[var(--tg-hint,#999)]">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[var(--tg-bg,#fff)]">
            <div className="flex-1 flex items-center justify-center">
                <ClickButton onClick={() => {
                }} />
            </div>
        </div>
    );
}
