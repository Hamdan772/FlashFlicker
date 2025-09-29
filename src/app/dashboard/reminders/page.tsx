
'use client';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const RemindersList = dynamic(() => import('@/components/reminders-list'), {
  ssr: false,
  loading: () => <Card>
      <CardHeader><CardTitle>Your Reminders</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>,
});

export default function RemindersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Study Reminders</h1>
        <p className="text-muted-foreground">
          Manage your upcoming deadlines, exams, and study sessions.
        </p>
      </div>
      
      <RemindersList />
    </div>
  );
}
