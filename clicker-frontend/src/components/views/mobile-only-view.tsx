'use client';

import Image from 'next/image';
import {useEffect, useState} from 'react';

interface MobileOnlyViewProps {
  platform: string;
  botUrl: string;
}

export function MobileOnlyView({platform, botUrl}: MobileOnlyViewProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  useEffect(() => {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(botUrl)}`;
    setQrUrl(qrApiUrl);
  }, [botUrl]);

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url(/bf.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
      }}
    >
      <div className="bg-black/50 backdrop-blur-md rounded-3xl p-8 mx-4 text-center max-w-sm">
        <div className="text-5xl mb-4">📱</div>

        <h1 className="text-white text-xl font-bold mb-2">Mobile Only</h1>

        <p className="text-white/70 text-sm mb-6">
          This app is only available on mobile devices. Scan the QR code to open in Telegram.
        </p>

        {qrUrl && (
          <div className="bg-white rounded-2xl p-3 inline-block mb-4">
            <Image src={qrUrl} alt="QR Code" width={160} height={160} unoptimized />
          </div>
        )}

        <p className="text-white/50 text-xs">Current platform: {platform}</p>
      </div>
    </div>
  );
}
