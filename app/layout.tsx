// app/layout.tsx
import type { Metadata, Viewport } from 'next'; // Added Viewport
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

// 1. Separate Viewport Export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#bae6fd' }, // Sky Blue
    { media: '(prefers-color-scheme: dark)', color: '#002366' },  // Royal Blue
  ],
};

export const metadata: Metadata = {
  title: 'TrustMark - Verified Seller Identity for Social Commerce',
  description: 'AI-powered trust badge for social commerce sellers. Get verified with mobile network APIs and build buyer confidence.',
  keywords: 'trustmark, seller verification, social commerce, KYC, SIM swap protection, Nigeria',
  authors: [{ name: 'TrustMark Team' }],
  // viewport removed from here
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {/* 2. Removed bg-gray-50 classes so your catchy global.css gradients take over */}
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
