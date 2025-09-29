
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Trash2, Edit } from 'lucide-react';
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
  const router = useRouter();
  const { isJudge } = useApiKey();

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else if (isJudge) {
        const judgeNotes = [demoNote];
        setNotes(judgeNotes);
        localStorage.setItem('notes', JSON.stringify(judgeNotes));
      }
    } catch (error) {
        console.error("Failed to access localStorage:", error);
        if (isJudge) {
            setNotes([demoNote]);
        }
    }
  }, [isJudge]);

  const deleteNote = (id: string) => {
    setNotes(prevNotes => {
        const updatedNotes = prevNotes.filter(note => note.id !== id);
        try {
            localStorage.setItem('notes', JSON.stringify(updatedNotes));
        } catch (error) {
            console.error("Failed to save notes to localStorage", error);
        }
        return updatedNotes;
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Notes</h1>
          <p className="text-muted-foreground">
            Create, edit, and summarize your notes with AI.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/notes/new">
            <PlusCircle className="mr-2" />
            New Note
          </Link>
        </Button>
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
