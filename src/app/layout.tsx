
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ApiKeyProvider } from '@/hooks/use-api-key';
import { GamificationProvider } from '@/hooks/use-gamification';
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from '@/components/providers';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


export const metadata: Metadata = {
  title: 'FlashFlicker',
  description: 'Your AI Study Companion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-body antialiased", inter.variable)}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ApiKeyProvider>
                <GamificationProvider>
                    {children}
                </GamificationProvider>
            </ApiKeyProvider>
            <Toaster />
          </ThemeProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
