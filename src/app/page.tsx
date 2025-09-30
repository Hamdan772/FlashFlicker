
'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpenCheck,
  ClipboardCheck,
  FileText,
  BrainCircuit,
  UploadCloud,
  Star,
  Zap,
  Target,
  BarChart,
  Bell,
  Trophy,
  FileUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Logo from '@/components/logo';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import React from 'react';

const features = [
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: 'AI Study Coach',
    description: 'Chat with an AI tutor that can answer questions based on your uploaded notes.',
  },
  {
    icon: <BookOpenCheck className="h-8 w-8" />,
    title: 'AI Quiz Generator',
    description: 'Turn your notes or any topic into interactive quizzes to master key concepts.',
  },
  {
    icon: <ClipboardCheck className="h-8 w-8" />,
    title: 'AI Flashcards',
    description:
      'Let our AI generate flashcard decks for you from any text content in seconds.',
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'AI Note Summarizer',
    description: 'Capture your thoughts and use AI to summarize long-form content instantly.',
  },
   {
    icon: <FileUp className="h-8 w-8" />,
    title: 'Document Upload',
    description: 'Import notes and documents directly from your files to use with AI tools.',
  },
  {
    icon: <Trophy className="h-8 w-8" />,
    title: 'Gamified Rewards',
    description: 'Earn XP, unlock badges, and maintain a study streak to stay motivated.',
  },
  {
    icon: <Bell className="h-8 w-8" />,
    title: 'Study Reminders',
    description: 'Automated, customizable reminders for upcoming study sessions and deadlines.',
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: 'Performance Analytics',
    description: 'Track your quiz scores and study habits to identify areas for improvement.',
  },
];

const howItWorksSteps = [
    {
        icon: <Zap className="h-8 w-8" />,
        title: 'Sign Up in Seconds',
        description: 'Create your account and get instant access to all of our AI-powered study tools.'
    },
    {
        icon: <UploadCloud className="h-8 w-8" />,
        title: 'Add Your Content',
        description: 'Upload your notes, documents, or simply type in a topic you want to master.'
    },
    {
        icon: <BrainCircuit className="h-8 w-8" />,
        title: 'Generate Study Tools',
        description: 'Let our AI create quizzes, flashcards, and summaries tailored to your material.'
    },
    {
        icon: <Target className="h-8 w-8" />,
        title: 'Track Your Progress',
        description: 'Stay motivated by watching your XP grow, your streak extend, and your badges stack up.'
    }
]

const testimonials = [
    {
        quote: "FlashFlicker transformed how I prepare for exams. The AI quiz generator is a game-changer!",
        name: "Jessica L.",
        role: "University Student",
        avatar: "https://picsum.photos/seed/avatar1/100/100"
    },
    {
        quote: "I used to spend hours making flashcards. Now, I can generate a deck from my notes in seconds. Incredible!",
        name: "David M.",
        role: "High School Student",
        avatar: "https://picsum.photos/seed/avatar2/100/100"
    },
    {
        quote: "The reward features actually make studying fun. I'm motivated to keep my streak going!",
        name: "Sarah K.",
        role: "College Student",
        avatar: "https://picsum.photos/seed/avatar3/100/100"
    },
    {
        quote: "The AI coach helped me understand a complex topic by explaining it in simple terms, using my own notes!",
        name: "Emily R.",
        role: "Graduate Student",
        avatar: "https://picsum.photos/seed/avatar4/100/100"
    },
    {
        quote: "I love how I can upload a PDF and instantly get a summary and a quiz. It saves me so much time.",
        name: "Michael B.",
        role: "University Student",
        avatar: "https://picsum.photos/seed/avatar5/100/100"
    },
    {
        quote: "The progress tracker helped me visualize where I was spending my time and improve my study habits.",
        name: "Alex C.",
        role: "College Freshman",
        avatar: "https://picsum.photos/seed/avatar6/100/100"
    },
     {
        quote: "An essential tool for any student. It's like having a personal study assistant available 24/7.",
        name: "Maria G.",
        role: "Medical Student",
        avatar: "https://picsum.photos/seed/avatar7/100/100"
    },
    {
        quote: "The gamification aspect is surprisingly effective. Earning badges for my hard work feels really rewarding.",
        name: "Tom W.",
        role: "High School Senior",
        avatar: "https://picsum.photos/seed/avatar8/100/100"
    }
]

export default function Home() {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    )

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="container z-50 mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard">
              Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
         <section className="relative w-full overflow-hidden pt-20 md:pt-32 lg:pt-40 pb-20">
            <div className="container relative z-10 mx-auto px-4 text-center">
                <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                   🚀 Your AI-Powered Study Companion
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline animate-text-glow">
                    FlashFlicker
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
                    Flick the card, spark the knowledge!
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" asChild>
                    <Link href="/dashboard">
                        Start Studying for Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    </Button>
                     <Button size="lg" variant="outline" asChild>
                        <Link href="#features">
                            Explore Features
                        </Link>
                    </Button>
                </div>
            </div>
        </section>


        <section
          id="features"
          className="w-full bg-muted/40 py-16 md:py-24"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                A Full Suite of AI-Powered Study Tools
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Everything you need to organize your study life, master concepts, and excel in your courses.
                </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                <div key={feature.title}>
                    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/10">
                        <CardHeader className="flex flex-col items-start gap-4 p-6">
                             <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                {feature.icon}
                            </div>
                            <CardTitle className="text-lg font-bold font-headline">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 px-6 pb-6">
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </CardContent>
                    </Card>
                </div>
                ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">How It Works</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Get started in just a few simple steps.
                    </p>
                </div>
                <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                   {howItWorksSteps.map((step, index) => (
                       <div key={index} className="text-center flex flex-col items-center">
                           <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                               {step.icon}
                           </div>
                           <h3 className="text-xl font-bold font-headline mb-2">{step.title}</h3>
                           <p className="text-muted-foreground">{step.description}</p>
                       </div>
                   ))}
                </div>
            </div>
        </section>

        <section id="gamification-highlight" className="w-full py-16 md:py-24 bg-muted/40">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Make Learning an Adventure</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Our reward system turns studying into a rewarding experience. Earn points for completing tasks, build up your study streak, and unlock over 50 badges to celebrate your milestones.
                        </p>
                         <Button size="lg" asChild className="mt-8">
                            <Link href="/dashboard">
                                Start Earning XP
                            </Link>
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <Card className="flex items-center p-4">
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-yellow-400/20 text-yellow-500 mr-4">
                                <Star className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-headline">New Badge Unlocked!</CardTitle>
                                <CardDescription>🎉 Power Learner</CardDescription>
                            </div>
                        </Card>
                         <Card className="flex items-center p-4">
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-400/20 text-red-500 mr-4">
                                <Zap className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-headline">10-Day Streak!</CardTitle>
                                <CardDescription>You&apos;re on fire! 🔥</CardDescription>
                            </div>
                        </Card>
                        <Card className="flex items-center p-4">
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20 text-primary mr-4">
                                <BarChart className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-headline">Level 5 Reached!</CardTitle>
                                <CardDescription>+1500 XP Gained</CardDescription>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        <section id="testimonials" className="w-full py-16 md:py-24 bg-background">
             <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Loved by Students Everywhere</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Don&apos;t just take our word for it. Here&apos;s what learners are saying about FlashFlicker.
                    </p>
                </div>
                <div className="mt-12">
                   <Carousel
                     plugins={[plugin.current]}
                     className="w-full"
                     onMouseEnter={plugin.current.stop}
                     onMouseLeave={plugin.current.reset}
                   >
                     <CarouselContent>
                       {testimonials.map((testimonial, index) => (
                         <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                           <div className="p-1">
                             <Card className="h-full">
                               <CardContent className="pt-6 flex flex-col justify-between h-full">
                                 <div>
                                   <div className="flex mb-2">
                                     {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                                   </div>
                                   <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                                 </div>
                                 <div className="flex items-center mt-auto">
                                   <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="rounded-full mr-4" />
                                   <div>
                                     <p className="font-semibold">{testimonial.name}</p>
                                     <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                   </div>
                                 </div>
                               </CardContent>
                             </Card>
                           </div>
                         </CarouselItem>
                       ))}
                     </CarouselContent>
                   </Carousel>
                </div>
            </div>
        </section>

        <section id="cta" className="w-full py-16 md:py-24 bg-muted/40 text-center">
            <div className="container mx-auto px-4 md:px-6">
                 <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Ready to Revolutionize Your Studying?</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                    Join thousands of students who are learning smarter, not harder. Sign up for free and unlock your full potential.
                </p>
                 <div className="mt-8 flex justify-center">
                    <Button size="lg" asChild>
                        <Link href="/dashboard">
                            Try Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>

      <footer className="border-t bg-background">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-center md:flex-row md:px-6">
          <Logo />
           <div className="flex flex-col sm:flex-row items-center gap-4">
            <a href="#features" className="text-sm text-muted-foreground hover:underline">Features</a>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">Contact</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">Privacy Policy</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FlashFlicker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
