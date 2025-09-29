
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ApiKeyProvider } from '@/hooks/use-api-key';
import { GamificationProvider } from '@/hooks/use-gamification';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

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
      </body>
    </html>
  );
}
