'use client';

import {useTelegramStore} from '@/store/telegram';

export function BanView() {
  const {webApp} = useTelegramStore();

  return (
    <div className="fixed inset-0 z-[9999] bg-red-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-2xl font-bold text-white mb-2">Account Suspended</h1>
      <p className="text-red-200 mb-6">Suspicious activity detected</p>
      <button
        type="button"
        onClick={() => webApp?.close()}
        className="px-6 py-3 bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        Close
      </button>
    </div>
  );
}
