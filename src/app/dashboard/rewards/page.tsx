
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Star } from 'lucide-react';
import { useGamification, availableBadges } from '@/hooks/use-gamification';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function RewardsPage() {
  const { progress, getLevelDetails } = useGamification();
  const { level, xpForNextLevel, progressPercentage } = getLevelDetails();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Rewards & Progress</h1>
        <p className="text-muted-foreground">
          Track your XP, streaks, and badges. Keep up the great work!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level {level}</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.xp} XP</div>
            <p className="text-xs text-muted-foreground">{xpForNextLevel} XP to next level</p>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up animation-delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.streak} Days</div>
            <p className="text-xs text-muted-foreground">{progress.streak > 0 ? "You're on fire!" : 'Start a new streak!'}</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up animation-delay-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.badges.length} / {availableBadges.filter(b => !b.secret).length}</div>
            <p className="text-xs text-muted-foreground">View your collection below</p>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-in-up animation-delay-400">
        <CardHeader>
          <CardTitle>Badge Collection</CardTitle>
          <CardDescription>Here are all the available badges. Keep studying to unlock them all!</CardDescription>
        </CardHeader>
        <CardContent>
            <TooltipProvider>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {availableBadges.map((badge) => {
                        const isUnlocked = progress.badges.some(b => b.id === badge.id);
                        
                        if (badge.secret && !isUnlocked) {
                            return null;
                        }

                        return (
                             <Tooltip key={badge.id}>
                                <TooltipTrigger>
                                    <div className={cn(
                                        "flex flex-col items-center text-center gap-2 p-4 border-2 rounded-lg transition-all",
                                        isUnlocked ? "border-primary/50 shadow-md" : "opacity-50 grayscale",
                                        isUnlocked && badge.secret && "border-purple-500 shadow-purple-500/20"
                                    )}>
                                        <span className={cn("text-6xl", isUnlocked && "animate-badge-pop")}>{isUnlocked ? badge.emoji : '❓'}</span>
                                        <span className="font-bold text-lg">{isUnlocked ? badge.name : 'Secret Badge'}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-bold">{badge.name}</p>
                                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                                    {isUnlocked ? (
                                        badge.secret && <p className="text-xs text-purple-500 mt-1">Secret</p>
                                    ) : (
                                        <p className="text-xs text-yellow-500 mt-1">Locked</p>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                </div>
            </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
