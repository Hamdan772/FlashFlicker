
'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { summarizeNote } from '@/ai/flows/summarize-note';
import { processFiles } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, Sparkles, Upload, File, X, BrainCircuit, Loader2 } from 'lucide-react';
import type { Note } from '../page';
import { useApiKey } from '@/hooks/use-api-key';
import { useGamification } from '@/hooks/use-gamification';
import { storage } from '@/lib/storage';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';


const RichTextEditor = dynamic(() => import('@/components/rich-text-editor'), {
  ssr: false,
  loading: () => <Skeleton className="h-[250px]" />,
});

type SummaryState = {
  summary?: string;
  error?: string;
}

type FileProcessingState = {
    content?: string;
    title?: string;
    error?: string;
}

function SummarizeButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" size="sm" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      {pending ? 'Summarizing...' : 'Summarize with AI'}
    </Button>
  );
}

function ImportContentButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {pending ? 'Importing...' : 'Import Content'}
        </Button>
    )
}

export default function NoteEditorPage() {
  const [note, setNote] = useState<Partial<Note>>({ title: '', content: '' });
  const [isNewNote, setIsNewNote] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { apiKey, isKeySet } = useApiKey();
  const { logAction, trackFeatureUse, addXp } = useGamification();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(event.target.files!)]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(files => {
        const newFiles = files.filter(file => file.name !== fileName);
        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            newFiles.forEach(file => dataTransfer.items.add(file));
            fileInputRef.current.files = dataTransfer.files;
        }
        return newFiles;
    });
  };
  
  const openFileDialog = () => {
    fileInputRef.current?.click();
  }

  const [summaryState, summaryAction] = useActionState(async (prevState: SummaryState, formData: FormData): Promise<SummaryState> => {
    const content = formData.get('content') as string;
    
    if (!content) {
      const error = 'Note content is empty.';
      toast({ title: 'Error', description: error, variant: 'destructive' });
      return { error };
    }
    if (!isKeySet) {
      const error = 'Please set your Gemini API key in the header.';
      toast({ title: 'Error', description: error, variant: 'destructive' });
      return { error };
    }
    try {
      // Create a temporary div to strip HTML tags for the summary
      const div = document.createElement('div');
      div.innerHTML = content;
      const textContent = div.textContent || div.innerText || '';

      const result = await summarizeNote({ noteContent: textContent, apiKey });
       if (result.summary) {
        toast({ title: 'Success', description: 'Summary has been generated.'});
        // Track AI feature usage
        trackFeatureUse('summarize');
      }
      return { summary: result.summary };
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      let friendlyMessage = `Failed to generate summary: ${errorMessage}`;
       if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('resource has been exhausted')) {
        friendlyMessage = 'Your API key has exceeded its quota. Please check your usage or try again later.';
      }
      toast({ title: 'Error', description: friendlyMessage, variant: 'destructive' });
      return { error: friendlyMessage };
    }
  }, { summary: ''});

  const [fileState, fileAction, isFileProcessing] = useActionState(async (prevState: FileProcessingState, formData: FormData): Promise<FileProcessingState> => {
    const files = formData.getAll('files') as File[];
    if (files.length === 0 || files.every(f => f.size === 0)) {
        return { error: "No files provided." };
    }

    try {
        const result = await processFiles(formData);
        if (result.error) {
            toast({ title: "File Read Error", description: result.error, variant: 'destructive' });
            return { error: result.error };
        }
        toast({ title: 'File Content Imported', description: 'The content of the files has been added to the note editor.' });
        return { content: result.content, title: result.title };
    } catch (e) {
        const error = e instanceof Error ? e.message : "An unknown error occurred during file processing.";
        toast({ title: "File Processing Failed", description: error, variant: 'destructive' });
        return { error };
    }
  }, { content: '' });
  
  useEffect(() => {
    if (fileState.content) {
        setNote(prev => ({
          ...prev,
          title: prev.title || fileState.title,
          content: (prev.content || '') + fileState.content,
        }));
        setUploadedFiles([]);
    }
  }, [fileState]);

  useEffect(() => {
    const noteSlug = params.note;
    if (noteSlug && noteSlug[0] === 'new') {
      setIsNewNote(true);
      setNote({ title: '', content: '' });
    } else if (noteSlug && noteSlug[0]) {
      const noteId = noteSlug[0];
      try {
        const savedNotes: Note[] = JSON.parse(localStorage.getItem('notes') || '[]');
        const currentNote = savedNotes.find(n => n.id === noteId);
        if (currentNote) {
          setNote(currentNote);
          setIsNewNote(false);
        } else {
          toast({ title: 'Error', description: 'Note not found.', variant: 'destructive' });
          router.push('/dashboard/notes');
        }
      } catch (error) {
        console.error('Failed to load note:', error);
        toast({ title: 'Error', description: 'Failed to load note. Storage may be corrupted.', variant: 'destructive' });
        router.push('/dashboard/notes');
      }
    }
  }, [params.note, router, toast]);
  
  const handleSave = () => {
    if (!note.title?.trim()) {
      toast({ title: 'Error', description: 'Title is required.', variant: 'destructive' });
      return;
    }

    try {
      const savedNotes: Note[] = storage.getItem<Note[]>('notes', []) || [];
      let updatedNotes;

      if (isNewNote) {
        const newNote: Note = {
          ...note,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        } as Note;
        updatedNotes = [newNote, ...savedNotes];
        if (note.content && note.content.length > 50) { // check for reasonable content length
          logAction('createNote');
          addXp(15); // Award XP for creating a note
        }
      } else {
        updatedNotes = savedNotes.map(n => (n.id === note.id ? { ...n, ...note } : n));
      }

      const success = storage.setItem('notes', updatedNotes, { compress: true });
      if (success) {
        toast({ title: 'Success', description: 'Note saved successfully!' });
        // Track feature usage
        trackFeatureUse('notes');
        router.push('/dashboard/notes');
      } else {
        throw new Error('Failed to save to storage');
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      toast({ 
        title: 'Save Failed', 
        description: 'Failed to save note. Please check your browser storage or try again.', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
            <h1 className="text-3xl font-bold font-headline">{isNewNote ? 'Create Note' : 'Edit Note'}</h1>
            <p className="text-muted-foreground">
            {isNewNote ? 'Add a new note to your collection.' : 'Edit your existing note.'}
            </p>
        </div>
      </div>
      
       {isNewNote && (
        <Card className="animate-fade-in">
             <form action={fileAction}>
                <CardHeader>
                    <CardTitle>Import from File(s)</CardTitle>
                    <CardDescription>Upload documents to automatically populate the note content.</CardDescription>
                </CardHeader>
                <CardContent>
                    {uploadedFiles.length > 0 ? (
                    <div className="space-y-4">
                        {uploadedFiles.map(file => (
                            <div key={file.name} className="p-3 border rounded-lg bg-muted/20 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <File className="h-6 w-6 text-primary" />
                                    <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(file.name)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                         <Button variant="outline" onClick={openFileDialog} type="button" disabled={isFileProcessing} className="w-full">
                            <Upload className="mr-2" />
                            Add more files...
                        </Button>
                    </div>
                    ) : (
                        <div 
                        className="border-2 border-dashed border-muted rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={openFileDialog}
                        >
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Drag & drop files or click to browse</p>
                        <p className="text-sm text-muted-foreground">Supports .pdf, .docx, .txt</p>
                        </div>
                    )}
                     <input 
                        id="file-upload-note"
                        ref={fileInputRef}
                        name="files"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.docx,.txt"
                        disabled={isFileProcessing}
                    />
                </CardContent>
                {uploadedFiles.length > 0 && (
                    <CardFooter>
                        <ImportContentButton />
                    </CardFooter>
                )}
            </form>
        </Card>
      )}

      {isNewNote && (
        <div className="relative animate-fade-in">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
        </div>
      )}
      
      <Card className="animate-fade-in">
        <CardHeader>
            <CardTitle>{isNewNote ? "Write Manually" : "Edit Content"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                    id="title" 
                    value={note.title || ''} 
                    onChange={e => setNote(prev => ({ ...prev, title: e.target.value }))} 
                    placeholder="Note title"
                />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                    key={note.id || 'new'}
                    value={note.content || ''}
                    onChange={newContent => setNote(prev => ({ ...prev, content: newContent }))}
                />
            </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-wrap gap-2">
            <div className="flex gap-2">
                <form action={summaryAction}>
                    <input type="hidden" name="content" value={note.content || ''} />
                    <SummarizeButton />
                </form>
                {!isNewNote && note.id && (
                    <Button variant="outline" size="sm" asChild>
                       <Link href={`/dashboard/coach?noteId=${note.id}`}>
                         <BrainCircuit className="mr-2 h-4 w-4" />
                         Discuss with AI
                       </Link>
                    </Button>
                )}
            </div>
            <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Note
            </Button>
        </CardFooter>
      </Card>
      {summaryState.summary && (
        <Card className="animate-fade-in">
            <CardHeader>
                <CardTitle>AI Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="prose prose-sm dark:prose-invert">{summaryState.summary}</p>
            </CardContent>
        </Card>
        )}
    </div>
  );
}
