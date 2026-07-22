import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#070A0F',
  initialScale: 1,
  width: 'device-width',
};

export const metadata: Metadata = {
  title: 'Daybreak | 새벽하늘 몰입 & 학습 관리 웹앱',
  description: '고등학생을 위한 차세대 몰입 타이머 & 학업 플래너',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Daybreak',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="antialiased bg-[#070A0F] text-[#F8FAFC] min-h-screen">
        {children}
      </body>
    </html>
  );
}
