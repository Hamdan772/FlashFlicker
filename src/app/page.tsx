
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
    title: 'AI Study Coach & Tutor',
    description: 'Get personalized tutoring with our intelligent AI study coach. Chat about your notes, ask questions, and receive expert guidance tailored to your learning style.',
  },
  {
    icon: <BookOpenCheck className="h-8 w-8" />,
    title: 'Smart Quiz Generator',
    description: 'Transform any study material into interactive quizzes instantly. Our AI quiz maker creates multiple-choice questions that help you master key concepts and ace your exams.',
  },
  {
    icon: <ClipboardCheck className="h-8 w-8" />,
    title: 'AI Flashcard Generator',
    description: 'Create perfect flashcards in seconds with FlashFlicker&apos;s smart flashcard generator. Turn any text, notes, or documents into memorable study cards automatically.',
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'Intelligent Note Summarizer',
    description: 'Save hours of study time with our AI note summarizer. Get concise, well-structured summaries from lengthy content, research papers, and textbook chapters.',
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
        name: "Thehan",
        role: "Student",
        avatar: "https://picsum.photos/seed/avatar1/100/100"
    },
    {
        quote: "I used to spend hours making flashcards. Now, I can generate a deck from my notes in seconds. Incredible!",
        name: "Rishi",
        role: "Student",
        avatar: "https://picsum.photos/seed/avatar2/100/100"
    },
    {
        quote: "The reward features actually make studying fun. I'm motivated to keep my streak going!",
        name: "Sarah",
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
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl floating"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-orange-500/10 rounded-full blur-xl floating-delayed"></div>
                <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl floating"></div>
            </div>
            
            <div className="container relative z-10 mx-auto px-4 text-center">
                <div className="mb-6 inline-block rounded-full bg-gradient-to-r from-primary/20 to-orange-500/20 border-2 border-primary/30 shadow-xl backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <div className="px-8 py-3 text-sm font-bold text-primary dark:text-white bg-background/80 rounded-full shadow-inner">
                       ✨ #1 AI-Powered Study Platform | Trusted by 10,000+ Students
                    </div>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline title-visible fade-in-up" style={{ 
                    color: '#fbbf24 !important', 
                    textShadow: '0 0 10px rgba(251, 191, 36, 0.8), 0 0 20px rgba(251, 191, 36, 0.6), 0 0 30px rgba(245, 158, 11, 0.4)',
                    fontWeight: '800'
                }}>
                    FlashFlicker
                </h1>
                <h2 className="mx-auto mt-4 max-w-4xl text-xl font-semibold text-muted-foreground md:text-2xl fade-in-up animation-delay-100">
                    AI Study Tools That Actually Work - Flash Flicker Your Way to Academic Success
                </h2>
                <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl fade-in-up animation-delay-200">
                    Transform your learning with FlashFlicker&apos;s intelligent flashcard generator, AI quiz maker, and personalized study coach. Join thousands of students boosting their grades with our smart learning platform.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up animation-delay-400">
                    <Button size="lg" className="gradient-bg hover-lift border-0 text-white shadow-lg" asChild>
                        <Link href="/dashboard">
                            Start Learning Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                     <Button size="lg" variant="outline" className="hover-lift border-primary/20 hover:border-primary/40" asChild>
                        <Link href="#features">
                            Discover Features
                        </Link>
                    </Button>
                </div>
                
                {/* Stats Section */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto fade-in-up animation-delay-400">
                    <div className="text-center">
                        <div className="text-2xl font-bold gradient-text">10K+</div>
                        <div className="text-sm text-muted-foreground">Active Students</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold gradient-text">1M+</div>
                        <div className="text-sm text-muted-foreground">Flashcards Created</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold gradient-text">95%</div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                </div>
            </div>
        </section>


        <section
          id="features"
          className="w-full bg-gradient-to-br from-background to-muted/20 py-16 md:py-24"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline gradient-text">
                A Full Suite of AI-Powered Study Tools
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Everything you need to organize your study life, master concepts, and excel in your courses.
                </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => (
                <div key={feature.title} className="group">
                    <Card className="relative flex flex-col h-full overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover-lift group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500">
                        {/* Gradient border effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-orange-500/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg blur-sm"></div>
                        
                        <CardHeader className="relative flex flex-col items-start gap-4 p-6 z-10">
                             <div className="relative rounded-xl gradient-bg p-3 text-white group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <CardTitle className="text-lg font-bold font-headline group-hover:gradient-text transition-all duration-300">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="relative flex-1 px-6 pb-6 z-10">
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                        </CardContent>
                        
                        {/* Floating number indicator */}
                        <div className="absolute top-4 right-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {index + 1}
                        </div>
                    </Card>
                </div>
                ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-muted/10">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline gradient-text">How It Works</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Get started in just a few simple steps and transform your learning.
                    </p>
                </div>
                <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                   {howItWorksSteps.map((step, index) => (
                       <div key={index} className="text-center flex flex-col items-center group relative">
                           {/* Connection line for larger screens */}
                           {index < howItWorksSteps.length - 1 && (
                               <div className="hidden lg:block absolute top-8 left-full w-12 h-0.5 bg-gradient-to-r from-primary/30 to-primary/10 z-0"></div>
                           )}
                           
                           <div className="relative flex items-center justify-center h-16 w-16 rounded-full gradient-bg text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                               {step.icon}
                               <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                           </div>
                           
                           <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 hover-lift group-hover:bg-card/50 transition-all duration-300">
                               <h3 className="text-xl font-bold font-headline mb-3 group-hover:gradient-text transition-all duration-300">{step.title}</h3>
                               <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                           </div>
                           
                           {/* Step number */}
                           <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                               {index + 1}
                           </div>
                       </div>
                   ))}
                </div>
            </div>
        </section>

        <section id="gamification-highlight" className="w-full py-16 md:py-24 bg-gradient-to-br from-primary/5 to-orange-500/5 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline gradient-text">Make Learning an Adventure</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Transform your study sessions into an engaging journey. Earn XP for every achievement, maintain study streaks, and unlock exclusive badges that showcase your dedication.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium">50+ Badges</span>
                            </div>
                            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2">
                                <Zap className="h-4 w-4 text-orange-500" />
                                <span className="text-sm font-medium">XP System</span>
                            </div>
                            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2">
                                <Trophy className="h-4 w-4 text-orange-500" />
                                <span className="text-sm font-medium">Leaderboards</span>
                            </div>
                        </div>
                         <Button size="lg" className="gradient-bg hover-lift text-white border-0 shadow-lg" asChild>
                            <Link href="/dashboard">
                                Start Your Journey
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <Card className="flex items-center p-6 hover-lift bg-card/70 backdrop-blur-sm border-yellow-200/50 group">
                            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Star className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-headline mb-1 group-hover:gradient-text transition-all duration-300">New Badge Unlocked!</CardTitle>
                                <CardDescription className="text-base">🎉 Power Learner Achievement</CardDescription>
                            </div>
                        </Card>
                         <Card className="flex items-center p-6 hover-lift bg-card/70 backdrop-blur-sm border-red-200/50 group">
                            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-red-400 to-orange-500 text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Zap className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-headline mb-1 group-hover:gradient-text transition-all duration-300">10-Day Streak!</CardTitle>
                                <CardDescription className="text-base">You&apos;re absolutely crushing it! 🔥</CardDescription>
                            </div>
                        </Card>
                        <Card className="flex items-center p-6 hover-lift bg-card/70 backdrop-blur-sm border-primary/50 group">
                            <div className="flex items-center justify-center h-14 w-14 rounded-xl gradient-bg text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <BarChart className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-headline mb-1 group-hover:gradient-text transition-all duration-300">Level 5 Reached!</CardTitle>
                                <CardDescription className="text-base">+1500 XP Gained - Keep going!</CardDescription>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        <section id="testimonials" className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-muted/10 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl"></div>
            
             <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline gradient-text">Loved by Students Everywhere</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Join thousands of learners who transformed their study experience with FlashFlicker.
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
                           <div className="p-2">
                             <Card className="h-full hover-lift bg-card/80 backdrop-blur-sm border-0 shadow-lg group relative overflow-hidden">
                               {/* Gradient background on hover */}
                               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                               
                               <CardContent className="pt-6 flex flex-col justify-between h-full relative z-10">
                                 <div>
                                   <div className="flex mb-4 gap-1">
                                     {[...Array(5)].map((_, i) => (
                                         <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
                                     ))}
                                   </div>
                                   <p className="text-muted-foreground mb-6 italic leading-relaxed text-sm group-hover:text-foreground/80 transition-colors duration-300">
                                       &ldquo;{testimonial.quote}&rdquo;
                                   </p>
                                 </div>
                                 <div className="flex items-center mt-auto">
                                   <div className="relative">
                                       <Image 
                                           src={testimonial.avatar} 
                                           alt={testimonial.name} 
                                           width={48} 
                                           height={48} 
                                           className="rounded-full mr-4 group-hover:scale-110 transition-transform duration-300 shadow-md" 
                                       />
                                       <div className="absolute inset-0 rounded-full border-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                   </div>
                                   <div>
                                     <p className="font-semibold group-hover:gradient-text transition-all duration-300">{testimonial.name}</p>
                                     <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                   </div>
                                 </div>
                               </CardContent>
                               
                               {/* Quote mark decoration */}
                               <div className="absolute top-4 right-4 text-6xl text-primary/10 font-serif leading-none group-hover:text-primary/20 transition-colors duration-300">
                                   &ldquo;
                               </div>
                             </Card>
                           </div>
                         </CarouselItem>
                       ))}
                     </CarouselContent>
                   </Carousel>
                </div>
            </div>
        </section>

        <section id="cta" className="w-full py-20 md:py-32 bg-gradient-to-br from-primary/10 via-orange-500/5 to-background text-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl floating"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl floating-delayed"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/5 to-orange-500/5 rounded-full blur-3xl"></div>
            </div>
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                 <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline gradient-text mb-6">Ready to Transform Your Learning?</h2>
                <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground leading-relaxed">
                    Join over 10,000 students who have revolutionized their study habits with AI-powered tools. Start your journey to academic excellence today.
                </p>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap justify-center gap-6 mt-8 mb-10">
                    <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Free Forever</span>
                    </div>
                    <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">No Credit Card</span>
                    </div>
                    <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Instant Setup</span>
                    </div>
                </div>
                
                 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button size="lg" className="gradient-bg hover-lift text-white border-0 shadow-2xl text-lg px-8 py-6" asChild>
                        <Link href="/dashboard">
                            Start Learning Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="hover-lift border-primary/30 hover:border-primary/60 text-lg px-8 py-6" asChild>
                        <Link href="#features">
                            Explore Features
                        </Link>
                    </Button>
                </div>
                
                <p className="mt-8 text-sm text-muted-foreground">
                    Trusted by students from 100+ universities worldwide
                </p>
            </div>
        </section>

      </main>

      <footer className="border-t border-primary/10 bg-gradient-to-b from-background to-muted/20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-orange-500/5"></div>
        <div className="container mx-auto relative z-10 px-4 py-12 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Logo section */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Logo />
              <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
                Empowering students worldwide with AI-powered learning tools.
              </p>
            </div>
            
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">How It Works</a>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">Contact</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">Privacy</Link>
            </div>
            
            {/* Copyright */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} FlashFlicker. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Built with ❤️ for learners everywhere
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
