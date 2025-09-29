
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, Calendar, PlusCircle, Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format, isPast, formatDistanceToNowStrict, add } from 'date-fns';
import { useApiKey } from '@/hooks/use-api-key';


type Reminder = {
    id: number,
    title: string,
    date: string,
    time: string,
    enabled: boolean,
};

const REMINDERS_STORAGE_KEY = 'flashflicker_reminders';

const demoReminders: Reminder[] = [
    {
        id: 1,
        title: 'Submit Biology Lab Report',
        date: format(add(new Date(), { days: 2 }), 'yyyy-MM-dd'),
        time: '23:59',
        enabled: true,
    },
    {
        id: 2,
        title: 'Study for Math Midterm',
        date: format(add(new Date(), { days: 5 }), 'yyyy-MM-dd'),
        time: '18:00',
        enabled: true,
    },
    {
        id: 3,
        title: 'History Essay Due',
        date: format(add(new Date(), { weeks: 2 }), 'yyyy-MM-dd'),
        time: '17:00',
        enabled: false,
    },
];

function ReminderDialog({ reminder, onSave, children }: { reminder?: Reminder, onSave: (reminder: Omit<Reminder, 'id' | 'enabled'>) => void, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(reminder?.title || '');
    const [date, setDate] = useState(reminder?.date || '');
    const [time, setTime] = useState(reminder?.time || '');
    const isEditing = !!reminder;

    useEffect(() => {
        if (open) {
            setTitle(reminder?.title || '');
            setDate(reminder?.date || format(new Date(), 'yyyy-MM-dd'));
            setTime(reminder?.time || format(new Date(), 'HH:mm'));
        }
    }, [open, reminder]);

    const handleSave = () => {
        if (title && date && time) {
            onSave({ title, date, time });
            setOpen(false);
        }
    };

    const isChanged = isEditing ? title !== reminder.title || date !== reminder.date || time !== reminder.time : title !== '' || date !== '' || time !== '';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                 <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Reminder' : 'Add New Reminder'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update the details for your reminder.' : 'Set up a new reminder to stay on top of your tasks.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Math homework" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">Date</Label>
                        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">Time</Label>
                        <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={!isChanged}>Save Reminder</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function RemindersList() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { isJudge } = useApiKey();

  useEffect(() => {
    setIsClient(true);
    try {
      const savedReminders = localStorage.getItem(REMINDERS_STORAGE_KEY);
      if (savedReminders) {
          const parsedReminders: Reminder[] = JSON.parse(savedReminders);
          const sortedReminders = parsedReminders.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
          setReminders(sortedReminders);
      } else if (isJudge) {
        const judgeReminders = demoReminders.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
        setReminders(judgeReminders);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
       if (isJudge) {
        setReminders(demoReminders);
      } else {
        setReminders([]);
      }
    }
  }, [isJudge]);

  useEffect(() => {
    if (isClient) {
        try {
            localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
        } catch(error) {
            console.error("Failed to save reminders to localStorage", error);
        }
    }
  }, [reminders, isClient]);

  const handleSaveReminder = (newReminderData: Omit<Reminder, 'id' | 'enabled'>, id?: number) => {
    setReminders(prevReminders => {
        let updatedReminders;
        if (id !== undefined) {
             updatedReminders = prevReminders.map(r => r.id === id ? { ...r, ...newReminderData } : r);
        } else {
            const newReminder: Reminder = {
                id: Date.now(),
                ...newReminderData,
                enabled: true,
            };
            updatedReminders = [...prevReminders, newReminder];
        }
        return updatedReminders.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    });
  };

  const toggleReminder = (id: number) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };
  
  const deleteReminder = (id: number) => {
    setReminders(prevReminders => {
      const updatedReminders = prevReminders.filter(reminder => reminder.id !== id);
      return updatedReminders;
    });
  };
  
  const getRelativeTime = (date: string, time: string) => {
      const targetDate = new Date(`${date}T${time}`);
      if (isPast(targetDate)) {
          return `${formatDistanceToNowStrict(targetDate)} ago`;
      }
      return `in ${formatDistanceToNowStrict(targetDate)}`;
  }
  
  if (!isClient) {
    return (
        <Card>
            <CardHeader><CardTitle>Your Reminders</CardTitle></CardHeader>
            <CardContent><div className="text-center text-muted-foreground py-8"><p>Loading reminders...</p></div></CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Reminders</CardTitle>
        <ReminderDialog onSave={(data) => handleSaveReminder(data)}>
             <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Reminder
            </Button>
        </ReminderDialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.length > 0 ? (
            reminders.map((reminder) => {
                const isPastDue = isPast(new Date(`${reminder.date}T${reminder.time}`));
                return (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between rounded-lg border p-4 animate-fade-in"
                  >
                    <div className="flex items-center gap-4">
                       <Bell className={`h-5 w-5 ${reminder.enabled && !isPastDue ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="font-medium">{reminder.title}</p>
                        <p className={`text-sm flex items-center gap-1 ${isPastDue ? 'text-destructive' : 'text-muted-foreground'}`}>
                          <Calendar className="h-3 w-3" />
                          {format(new Date(`${reminder.date}T00:00:00`), 'MMM d, yyyy')}, {reminder.time}
                          <span className="text-xs ml-2">({getRelativeTime(reminder.date, reminder.time)})</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                        aria-label={`Toggle reminder for ${reminder.title}`}
                        />
                        <ReminderDialog reminder={reminder} onSave={(data) => handleSaveReminder(data, reminder.id)}>
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        </ReminderDialog>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={reminder.id <= 3}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your reminder.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteReminder(reminder.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </div>
                )
            })
          ) : (
            <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
              <Bell className="mx-auto h-12 w-12" />
              <p className="mt-4">No reminders yet.</p>
              <p className="text-sm">Click &quot;New Reminder&quot; to add one.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
