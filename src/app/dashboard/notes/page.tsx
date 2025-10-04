
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Trash2, Edit, Save } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"
import { useApiKey } from '@/hooks/use-api-key';
import { storage, storageUtils } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useGamification } from '@/hooks/use-gamification';

export type Note = {
  id: string;
  title: string;
  content: string; // Content is now HTML
  createdAt: string;
};

const demoNote: Note = {
  id: 'demo-note',
  title: 'Demo: The Solar System',
  content: `
    <p>The Solar System is the gravitationally bound system of the Sun and the objects that orbit it, either directly or indirectly.</p>
    <h2>Planets</h2>
    <p>There are eight planets in the Solar System. In order from the Sun, they are:</p>
    <ol>
      <li>Mercury</li>
      <li>Venus</li>
      <li>Earth</li>
      <li>Mars</li>
      <li>Jupiter</li>
      <li>Saturn</li>
      <li>Uranus</li>
      <li>Neptune</li>
    </ol>
    <p>Jupiter is the largest planet, while Mercury is the smallest.</p>
  `,
  createdAt: new Date().toISOString(),
};


export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { isJudge } = useApiKey();
  const { toast } = useToast();
  const { trackFeatureUse } = useGamification();

  // Create debounced saver for auto-save functionality
  const debouncedSaveNotes = useMemo(
    () => storageUtils.createDebouncedSetter<Note[]>('notes', 500),
    []
  );

  useEffect(() => {
    try {
      const savedNotes = storage.getItem<Note[]>('notes', []);
      if (savedNotes && savedNotes.length > 0) {
        setNotes(savedNotes);
      } else if (isJudge) {
        const judgeNotes = [demoNote];
        setNotes(judgeNotes);
        storage.setItem('notes', judgeNotes, { compress: true });
      }
    } catch (error) {
        console.error("Failed to access storage:", error);
        if (isJudge) {
            setNotes([demoNote]);
        }
    }
  }, [isJudge]);

  // Auto-save notes when they change
  useEffect(() => {
    if (notes.length > 0) {
      debouncedSaveNotes(notes);
    }
  }, [notes, debouncedSaveNotes]);

  const saveNotesImmediately = async () => {
    setIsSaving(true);
    try {
      const success = storage.setItem('notes', notes, { compress: true });
      if (success) {
        toast({
          title: "Notes Saved",
          description: "All notes have been saved successfully.",
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      toast({
        title: "Save Failed",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    
    try {
      storage.setItem('notes', updatedNotes, { compress: true });
      setNotes(updatedNotes);
      
      // Track feature usage for notes management (after state update)
      trackFeatureUse('notes');
      
      toast({
        title: "Note Deleted",
        description: "Note has been deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to save notes to storage", error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Notes</h1>
          <p className="text-muted-foreground">
            Create, edit, and summarize your notes with AI. Auto-saves enabled.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={saveNotesImmediately}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Now'}
          </Button>
          <Button asChild>
            <Link href="/dashboard/notes/new">
              <PlusCircle className="mr-2" />
              New Note
            </Link>
          </Button>
        </div>
      </div>
      
      {notes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map(note => (
            <Card key={note.id} className="flex flex-col hover:shadow-lg hover:shadow-primary/10 hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{note.title}</span>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Created on {new Date(note.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div 
                    className="prose prose-sm dark:prose-invert line-clamp-3 text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: note.content || "<p>No content</p>" }} 
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                 <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/notes/${note.id}`)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={note.id === 'demo-note'}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your note.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteNote(note.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Notes</CardTitle>
            <CardDescription>You have no notes yet. Create one to get started!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No notes found.</p>
               <Button asChild className="mt-4">
                  <Link href="/dashboard/notes/new">
                    <PlusCircle className="mr-2" />
                    Create a Note
                  </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
