import type {Metadata, Viewport} from 'next';
import {Geist} from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import {TelegramProvider} from '@/context/telegram-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Clicker',
  description: 'Telegram Mini App Clicker Game'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
