
'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Star,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { getNavLinks } from '@/lib/nav-links';
import { getFeatureDescription } from '@/lib/utils';
import { useGamification } from '@/hooks/use-gamification';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useApiKey } from '@/hooks/use-api-key';

function GamificationPanel() {
    const { progress, getLevelDetails } = useGamification();
    const { level, progressPercentage, xpForNextLevel } = getLevelDetails();

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-medium font-headline">Your Progress</CardTitle>
                    <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <CardDescription>Level {level} - {xpForNextLevel} XP to next level</CardDescription>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Progress value={progressPercentage} className="mt-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{progress.xp} / {(level * 100) + 100} XP</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
                 <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                        <Flame className="h-6 w-6 text-orange-500" />
                        <p className="font-medium">Study Streak</p>
                    </div>
                    <p className="font-bold text-lg">{progress.streak} days</p>
                </div>
                <div>
                    <h3 className="font-medium mb-3">Recent Badges</h3>
                    <div className="flex flex-wrap gap-3">
                        {progress.badges.length > 0 ? (
                            <TooltipProvider>
                                {progress.badges.slice(-4).map((badge, index) => (
                                    <Tooltip key={index}>
                                        <TooltipTrigger>
                                            <Badge variant="outline" className="text-2xl p-3 border-2 transition-transform hover:scale-110">{badge.emoji}</Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="font-bold">{badge.name}</p>
                                            <p className="text-sm text-muted-foreground">{badge.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </TooltipProvider>
                        ) : (
                            <p className="text-sm text-muted-foreground">No badges earned yet.</p>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full">
                     <Link href="/dashboard/rewards">
                         View All Rewards <ArrowRight className="ml-2 h-4 w-4" />
                     </Link>
                 </Button>
            </CardFooter>
        </Card>
    )
}

export default function DashboardPage() {
  const { isOwner } = useApiKey();
  const navLinks = getNavLinks(isOwner);
  const features = navLinks.filter(link => link.href !== '/dashboard' && link.href !== '/dashboard/rewards');

  return (
    <>
      <div className="space-y-1.5">
        <h1 className="text-4xl font-bold tracking-tight font-headline">Welcome, Student!</h1>
        <p className="mt-1 text-lg text-muted-foreground">
          Let&apos;s get studying! Here are your tools to help you succeed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
                <Link href={feature.href} key={feature.label} className="group">
                <Card className="flex flex-col h-full transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
                    <CardHeader>
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                            <feature.icon className="h-6 w-6" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <CardTitle className="text-xl font-medium font-headline mb-1">
                            {feature.label}
                        </CardTitle>
                        <CardDescription>
                            {getFeatureDescription(feature.label)}
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                         <div className="text-sm font-medium text-primary group-hover:underline flex items-center">
                            Go to {feature.label.split(' ')[0]} <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </CardFooter>
                </Card>
                </Link>
            ))}
        </div>
        <div className="lg:col-span-1">
            <GamificationPanel />
        </div>
      </div>
    </>
  );
}
