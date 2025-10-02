
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
import { KonamiCodeDetector } from '@/components/konami-code-detector';
import StructuredData from '@/components/structured-data';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


export const metadata: Metadata = {
  metadataBase: new URL('https://flash-flicker.vercel.app'),
  title: {
    default: 'FlashFlicker - AI-Powered Study Platform | Smart Learning Tools',
    template: '%s | FlashFlicker'
  },
  description: 'Transform your learning with FlashFlicker\'s AI-powered study tools. Generate flashcards, quizzes, and summaries from your notes. Features gamification, progress tracking, and personalized AI coaching for better academic performance.',
  keywords: [
    'flashflicker',
    'flash flicker', 
    'AI study tools',
    'flashcards generator',
    'quiz maker',
    'study app',
    'learning platform',
    'AI tutor',
    'educational technology',
    'study assistant',
    'smart flashcards',
    'AI quiz generator',
    'study coach',
    'learning analytics',
    'gamified learning',
    'note summarizer',
    'exam preparation',
    'academic success',
    'AI-powered education',
    'personalized learning'
  ],
  authors: [{ name: 'FlashFlicker Team', url: 'https://github.com/Hamdan772' }],
  creator: 'Hamdan Nishad',
  publisher: 'FlashFlicker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flash-flicker.vercel.app',
    siteName: 'FlashFlicker',
    title: 'FlashFlicker - AI-Powered Study Platform | Smart Learning Tools',
    description: 'Transform your learning with AI-generated flashcards, quizzes, and personalized study coaching. Join thousands of students achieving academic success with FlashFlicker.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FlashFlicker - AI Study Platform Dashboard',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FlashFlicker',
    creator: '@Hamdan772',
    title: 'FlashFlicker - AI-Powered Study Platform',
    description: 'Transform your learning with AI-generated study materials and personalized coaching',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://flash-flicker.vercel.app',
    languages: {
      'en-US': 'https://flash-flicker.vercel.app',
    },
  },
  category: 'education',
  classification: 'Educational Technology',
  other: {
    'google-site-verification': 'Y_qktTqL7vK0l4jNhE0m2DfCeQ1m6be5Dp8I8rxUQP0',
  },
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
                    <KonamiCodeDetector />
                    {children}
                </GamificationProvider>
            </ApiKeyProvider>
            <Toaster />
          </ThemeProvider>
        </Providers>
        <Analytics />
        <StructuredData />
      </body>
    </html>
  );
}
