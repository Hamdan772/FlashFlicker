'use client';

import { useState, useEffect, useActionState, useRef, Suspense } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send, User, Bot, Copy } from 'lucide-react';
import { useApiKey } from '@/hooks/use-api-key';
import { useToast } from '@/hooks/use-toast';
import { MarkdownFormatter } from '@/components/markdown-formatter';
import type { Note } from '../notes/page';
import { chatWithCoach } from '@/ai/flows/chat-with-coach';
import type { ChatMessage } from './definitions';
import { useSearchParams } from 'next/navigation';


function ChatSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Send />}
      <span className="sr-only">Send message</span>
    </Button>
  );
}

function CoachPageContent() {
  const { apiKey, isKeySet } = useApiKey();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const noteIdFromQuery = searchParams.get('noteId');

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
 const [, formAction, isPending] = useActionState(async (_prevState: unknown, formData: FormData) => {
    const message = formData.get('message') as string;
    
    if (!isKeySet) {
        toast({ title: 'API Key Required', description: 'Please set your Gemini API key in the header.', variant: 'destructive'});
        return null;
    }
    if (!message || message.trim() === '') return null;

    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
    try {
        if (!apiKey) {
            toast({
                title: 'API Key Required',
                description: 'Please set your Gemini API key to use AI features.',
                variant: 'destructive'
            });
            return;
        }

        const selectedNote = notes.find(n => n.id === selectedNoteId);
        const result = await chatWithCoach({
            message,
            history: chatHistory,
            noteContext: selectedNote?.content,
            apiKey,
        });

        if (result.reply) {
            const assistantMessage: ChatMessage = { role: 'assistant', content: result.reply };
            setChatHistory(prev => [...prev, assistantMessage]);
        } else {
            toast({ title: 'Error', description: 'The AI did not provide a reply.', variant: 'destructive' });
        }
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota')) {
            toast({ title: 'Error', description: 'Your API key has exceeded its quota. Please check your usage or try again later.', variant: 'destructive'});
        } else {
            toast({ title: 'Error', description: `Failed to get response: ${errorMessage}`, variant: 'destructive'});
        }
    }

    return null;
  }, null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (noteIdFromQuery) {
        setSelectedNoteId(noteIdFromQuery);
    }
  }, [noteIdFromQuery]);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied!', description: 'AI response copied to clipboard.'});
  }

  const handleSelectChange = (value: string) => {
    setSelectedNoteId(value === 'none' ? '' : value);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">AI Study Coach</h1>
        <p className="text-muted-foreground">
          Chat with an AI tutor to get help with your study materials.
        </p>
      </div>

      <Card className="h-[70vh] flex flex-col">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Chat Session</CardTitle>
                <CardDescription>Select a note to give the AI context (optional).</CardDescription>
              </div>
              <Select value={selectedNoteId || 'none'} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Select a note for context..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {notes.map(note => (
                        <SelectItem key={note.id} value={note.id}>{note.title}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatHistory.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                    <div className="max-w-md space-y-4">
                        <Bot className="mx-auto h-12 w-12 text-primary" />
                        <div>
                          <h3 className="text-lg font-semibold mb-2">AI Study Coach</h3>
                          <p className="text-muted-foreground mb-4">
                            Get personalized help with your study materials. I can explain concepts, create study plans, and answer questions.
                          </p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg text-left text-sm">
                          <p className="font-medium mb-2">Try asking:</p>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• &quot;Explain photosynthesis in simple terms&quot;</li>
                            <li>• &quot;Help me understand calculus derivatives&quot;</li>
                            <li>• &quot;Create a study schedule for my exam&quot;</li>
                            <li>• &quot;What are the key points in my notes?&quot;</li>
                          </ul>
                        </div>
                    </div>
                </div>
            ) : (
                 <div className="space-y-4">
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'assistant' && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Bot className="h-5 w-5" />
                          </div>
                        )}
                        <div className={`rounded-lg p-4 max-w-2xl ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm'
                        }`}>
                          {msg.role === 'assistant' ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Bot className="h-3 w-3" />
                                <span>AI Study Coach</span>
                              </div>
                              <MarkdownFormatter content={msg.content} />
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                          )}
                          {msg.role === 'assistant' && (
                            <div className="flex justify-end mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCopy(msg.content)} 
                                className="text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy Response
                              </Button>
                            </div>
                          )}
                        </div>
                        {msg.role === 'user' && (
                           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isPending && (
                       <div className="flex items-start gap-3">
                           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Bot className="h-5 w-5" />
                           </div>
                           <div className="rounded-lg p-3 bg-muted flex items-center">
                               <Loader2 className="animate-spin h-5 w-5" />
                           </div>
                       </div>
                    )}
                 </div>
            )}
        </CardContent>
        <div className="p-4 border-t">
          <form action={formAction} className="flex items-center gap-2">
            <Input 
              name="message" 
              placeholder="Ask a question about your notes..." 
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              disabled={isPending || !isKeySet}
            />
            <ChatSubmitButton />
          </form>
        </div>
      </Card>
    </div>
  );
}

export default function CoachPage() {
  return (
    <Suspense fallback={<div>Loading coach...</div>}>
      <CoachPageContent />
    </Suspense>
  );
}
