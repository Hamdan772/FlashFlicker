
'use client';

import { useState, useActionState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, Wand2, ArrowLeft, ArrowRight, Loader2, Trash2, BookOpen, Shuffle, Edit, PlusCircle, Save, Undo } from 'lucide-react';
import { generateFlashcards, type Flashcard } from '@/ai/flows/generate-flashcards';
import { useApiKey } from '@/hooks/use-api-key';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useGamification } from '@/hooks/use-gamification';
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';


type EditableFlashcard = Flashcard & { originalFront?: string, originalBack?: string };

type FlashcardDeck = {
    id: string;
    name: string;
    cards: EditableFlashcard[];
    createdAt: string;
}

type ActionState = {
    newDeck?: FlashcardDeck;
    error?: string;
}

const FLASHCARD_DECKS_STORAGE_KEY = 'flashflicker_decks';

const demoDeck: FlashcardDeck = {
    id: 'demo-deck',
    name: 'Demo: US State Capitals',
    createdAt: new Date().toISOString(),
    cards: [
        { front: 'California', back: 'Sacramento' },
        { front: 'Texas', back: 'Austin' },
        { front: 'New York', back: 'Albany' },
        { front: 'Florida', back: 'Tallahassee' },
        { front: 'Illinois', back: 'Springfield' },
    ]
};

function GenerateButton() {    
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
            {pending ? 'Generating...' : 'Generate Deck'}
        </Button>
    )
}

function FlashcardViewer({ 
    deck: initialDeck, 
    onBack, 
    onDeckUpdate 
}: { 
    deck: FlashcardDeck, 
    onBack: () => void,
    onDeckUpdate: (updatedDeck: FlashcardDeck) => void 
}) {
    const [deck, setDeck] = useState(initialDeck);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCard, setEditingCard] = useState<EditableFlashcard | null>(null);
    const { logAction, addXp, trackFeatureUse } = useGamification();
    const { toast } = useToast();

    useEffect(() => {
        setDeck(initialDeck);
    }, [initialDeck]);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            const nextIndex = (currentIndex + 1) % deck.cards.length;
            setCurrentIndex(nextIndex);
            if(nextIndex === 0 && deck.cards.length > 1) {
                 addXp(20);
                 logAction('createFlashcardDeck');
                 trackFeatureUse('flashcards');
                 toast({ title: "Deck Completed!", description: "You earned 20 XP for reviewing the deck."});
            }
        }, 150);
    }

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex((prev) => (prev - 1 + deck.cards.length) % deck.cards.length), 150);
    }

    const handleShuffle = () => {
        const shuffledCards = [...deck.cards].sort(() => Math.random() - 0.5);
        const newDeck = { ...deck, cards: shuffledCards };
        setDeck(newDeck);
        onDeckUpdate(newDeck);
        setCurrentIndex(0);
        setIsFlipped(false);
        toast({ title: 'Deck Shuffled!', description: 'The card order has been randomized.' });
    }
    
    const handleStartEdit = () => {
        setEditingCard({ ...deck.cards[currentIndex] });
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        if (!editingCard) return;
        const updatedCards = deck.cards.map((card, index) => {
            if (index === currentIndex) {
                // Preserve original if it's the first edit
                const originalFront = card.originalFront || (editingCard.front !== card.front ? card.front : undefined);
                const originalBack = card.originalBack || (editingCard.back !== card.back ? card.back : undefined);
                return { ...editingCard, originalFront, originalBack };
            }
            return card;
        });
        const newDeck = { ...deck, cards: updatedCards };
        setDeck(newDeck);
        onDeckUpdate(newDeck);
        setIsEditing(false);
        setEditingCard(null);
        toast({ title: 'Card Updated', description: 'Your changes have been saved.'});
    };
    
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingCard(null);
    }

    const handleDeleteCard = () => {
        const updatedCards = deck.cards.filter((_, index) => index !== currentIndex);
        if (updatedCards.length === 0) {
            const emptyDeck = { ...deck, cards: [] };
            onDeckUpdate(emptyDeck);
        } else {
            const newIndex = currentIndex >= updatedCards.length ? updatedCards.length - 1 : currentIndex;
            const newDeck = { ...deck, cards: updatedCards };
            onDeckUpdate(newDeck);
            setCurrentIndex(newIndex);
        }
        toast({ title: 'Card Deleted', description: 'The card has been removed from the deck.'});
    }

    const handleAddCard = (newCard: Flashcard) => {
        const newCards = [...deck.cards, newCard];
        const newDeck = { ...deck, cards: newCards };
        onDeckUpdate(newDeck);
        toast({ title: 'Card Added', description: 'A new card has been added to your deck.'});
    }

    const handleRevertCard = () => {
        const currentCard = deck.cards[currentIndex];
        if (!currentCard.originalFront && !currentCard.originalBack) return;

        const revertedCards = deck.cards.map((card, index) => {
            if (index === currentIndex) {
                return {
                    front: card.originalFront || card.front,
                    back: card.originalBack || card.back,
                    // originalFront and originalBack are cleared
                };
            }
            return card;
        });
        const newDeck = { ...deck, cards: revertedCards };
        onDeckUpdate(newDeck);
        toast({ title: 'Card Reverted', description: 'The card has been restored to its original content.'});
    };


    if (!deck || deck.cards.length === 0) {
        return (
             <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{deck.name}</CardTitle>
                        <Button variant="outline" size="sm" onClick={onBack}>
                            <ArrowLeft className="mr-2" /> Back to Decks
                        </Button>
                    </div>
                     <CardDescription>This deck is empty. Add a new card to get started.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                   <AddCardDialog onAddCard={handleAddCard}>
                        <Button><PlusCircle className="mr-2"/>Add First Card</Button>
                   </AddCardDialog>
                </CardContent>
            </Card>
        )
    }

    const currentCard = deck.cards[currentIndex];
    const isCardEdited = !!currentCard.originalFront || !!currentCard.originalBack;

    return (
        <>
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{deck.name}</CardTitle>
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <ArrowLeft className="mr-2" /> Back to Decks
                    </Button>
                </div>
                <CardDescription>Review your cards below. Click a card to flip it, or edit the deck.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                 <div 
                    className="w-full max-w-md h-64 perspective-1000 cursor-pointer"
                    onClick={() => !isEditing && setIsFlipped(!isFlipped)}
                >
                    <div className={cn(
                        "relative w-full h-full transform-style-preserve-3d transition-transform duration-500",
                        isFlipped && 'rotate-y-180'
                    )}>
                        {/* Front of card */}
                        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 border rounded-lg bg-card shadow-lg">
                            <p className="text-xl text-center font-semibold">{currentCard.front}</p>
                        </div>
                        {/* Back of card */}
                        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 border rounded-lg bg-secondary shadow-lg rotate-y-180">
                             <p className="text-lg text-center">{currentCard.back}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between w-full max-w-md">
                    <Button variant="outline" onClick={handlePrev}><ArrowLeft className="mr-2" /> Prev</Button>
                    <p className="text-muted-foreground">{currentIndex + 1} / {deck.cards.length}</p>
                    <Button variant="outline" onClick={handleNext}>Next <ArrowRight className="ml-2" /></Button>
                </div>
                 {isCardEdited && <Badge variant="outline">Edited</Badge>}
            </CardContent>
            <CardFooter className="flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShuffle}><Shuffle className="mr-2" /> Shuffle</Button>
                <Button variant="outline" size="sm" onClick={handleStartEdit}><Edit className="mr-2" /> Edit Card</Button>
                 {isCardEdited && (
                    <Button variant="outline" size="sm" onClick={handleRevertCard}>
                        <Undo className="mr-2" /> Revert
                    </Button>
                )}
                 <AddCardDialog onAddCard={handleAddCard}>
                    <Button variant="outline" size="sm"><PlusCircle className="mr-2"/>Add New Card</Button>
                </AddCardDialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm"><Trash2 className="mr-2" /> Delete Card</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete this card from the deck.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteCard}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
        
        {isEditing && editingCard && (
             <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Flashcard</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="edit-front">Front</Label>
                            <Textarea id="edit-front" value={editingCard.front} onChange={e => setEditingCard({...editingCard, front: e.target.value})} className="min-h-[100px]" />
                        </div>
                         <div>
                            <Label htmlFor="edit-back">Back</Label>
                            <Textarea id="edit-back" value={editingCard.back} onChange={e => setEditingCard({...editingCard, back: e.target.value})} className="min-h-[100px]" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                        <Button onClick={handleSaveEdit}><Save className="mr-2" /> Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
        {/* Added style block to fix flip animation */}
        <style jsx>{`
            .perspective-1000 { perspective: 1000px; }
            .transform-style-preserve-3d { transform-style: preserve-3d; }
            .rotate-y-180 { transform: rotateY(180deg); }
            .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        `}</style>
        </>
    )
}

function AddCardDialog({ onAddCard, children }: { onAddCard: (card: Flashcard) => void, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');

    const handleSave = () => {
        if(front && back) {
            onAddCard({ front, back });
            setOpen(false);
            setFront('');
            setBack('');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Card</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="new-front">Front</Label>
                        <Textarea id="new-front" value={front} onChange={e => setFront(e.target.value)} placeholder="Question or term" />
                    </div>
                    <div>
                        <Label htmlFor="new-back">Back</Label>
                        <Textarea id="new-back" value={back} onChange={e => setBack(e.target.value)} placeholder="Answer or definition" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Add Card</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


function SavedDecks({ decks, onStudy, onDelete }: { decks: FlashcardDeck[], onStudy: (deckId: string) => void, onDelete: (deckId: string) => void }) {
    if (decks.length === 0) {
        return (
             <Card>
                <CardHeader>
                <CardTitle>Your Saved Decks</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                     <File className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No flashcard decks found.</p>
                     <p className="text-sm">Generate one to get started!</p>
                </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Saved Decks</CardTitle>
                <CardDescription>Here are the flashcard decks you&apos;ve generated. Click one to start studying.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {decks.map(deck => (
                    <Card key={deck.id} className="flex flex-col animate-pop-in">
                        <CardHeader>
                            <CardTitle className="truncate">{deck.name}</CardTitle>
                            <CardDescription>{deck.cards.length} cards</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-xs text-muted-foreground">
                                Created on {new Date(deck.createdAt).toLocaleDateString()}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => onStudy(deck.id)}>
                                <BookOpen className="mr-2" /> Study
                            </Button>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" disabled={deck.id === 'demo-deck'}>
                                        <Trash2 className="mr-2" /> Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your flashcard deck.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onDelete(deck.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}


export default function FlashcardsPage() {
  const [savedDecks, setSavedDecks] = useState<FlashcardDeck[]>([]);
  const [studyingDeckId, setStudyingDeckId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [numCards, setNumCards] = useState(10);

  const { apiKey, isKeySet, isJudge } = useApiKey();
  const { toast } = useToast();
  const { logAction, trackFeatureUse, addXp } = useGamification();

  useEffect(() => {
    try {
        const storedDecks = localStorage.getItem(FLASHCARD_DECKS_STORAGE_KEY);
        if (storedDecks) {
            setSavedDecks(JSON.parse(storedDecks));
        } else if (isJudge) {
            setSavedDecks([demoDeck]);
        }
    } catch (error) {
        console.error("Failed to load decks from localStorage", error);
        if (isJudge) {
            setSavedDecks([demoDeck]);
        }
    }
  }, [isJudge]);

  const [state, formAction] = useActionState(async (prevState: ActionState | undefined, formData: FormData): Promise<ActionState> => {
    if (!isKeySet) {
        const error = "Please set your Gemini API key to generate flashcards.";
        toast({ title: 'Error', description: error, variant: 'destructive'});
        return { error };
    }

    const textContent = formData.get('textContent') as string;
    const deckName = formData.get('deckName') as string;
    const numCards = Number(formData.get('numCards'));
    
    if (!textContent.trim()) {
        const error = 'Please paste some text to generate flashcards from.';
        toast({ title: 'Error', description: error, variant: 'destructive'});
        return { error };
    }
    
    const finalDeckName = deckName || textContent.substring(0, 20) || "My New Deck";

    try {

        
        if (!apiKey) {
            toast({
                title: 'API Key Required',
                description: 'Please set your Gemini API key to use AI features.',
                variant: 'destructive'
            });
            return { error: 'API key required' };
        }
        
        const result = await generateFlashcards({
            content: textContent,
            numCards,
            apiKey,
        });

        if (result.flashcards && result.flashcards.length > 0) {
            logAction('createFlashcardDeck');
            trackFeatureUse('flashcards');
            addXp(20); // Award XP for creating flashcard deck
            toast({ title: 'Success!', description: `Generated ${result.flashcards.length} flashcards.`});
            
            const newDeck: FlashcardDeck = {
                id: Date.now().toString(),
                name: finalDeckName,
                cards: result.flashcards,
                createdAt: new Date().toISOString(),
            };

            return { newDeck };
        }
        const error = 'Could not generate flashcards from the provided content.';
        toast({ title: 'Error', description: error, variant: 'destructive'});
        return { error };

    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        let friendlyMessage = `Failed to generate flashcards: ${errorMessage}`;
        if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota')) {
            friendlyMessage = 'Your API key has exceeded its quota. Please check your usage or try again later.';
        }
        toast({ title: 'Error', description: friendlyMessage, variant: 'destructive'});
        return { error: friendlyMessage };
    }
  }, undefined);

  useEffect(() => {
    if (state?.newDeck) {
        setSavedDecks(prevDecks => {
            const updatedDecks = [state.newDeck!, ...prevDecks];
            try {
                localStorage.setItem(FLASHCARD_DECKS_STORAGE_KEY, JSON.stringify(updatedDecks));
            } catch (error) {
                console.error("Failed to save decks to localStorage", error);
            }
            return updatedDecks;
        });
        setStudyingDeckId(state.newDeck.id);
        if (formRef.current) {
            formRef.current.reset();
        }
        setNumCards(10);
    }
  }, [state?.newDeck]);

  const handleDeleteDeck = (deckId: string) => {
    setSavedDecks(prevDecks => {
        const updatedDecks = prevDecks.filter(d => d.id !== deckId);
        try {
            localStorage.setItem(FLASHCARD_DECKS_STORAGE_KEY, JSON.stringify(updatedDecks));
        } catch (error) {
            console.error("Failed to save decks to localStorage", error);
        }
        return updatedDecks;
    });
    toast({ title: 'Deck Deleted', description: 'The flashcard deck has been removed.' });
  }

  const handleDeckUpdate = useCallback((updatedDeck: FlashcardDeck) => {
      setSavedDecks(prevDecks => {
          const newDecks = prevDecks.map(d => d.id === updatedDeck.id ? updatedDeck : d);
          try {
            localStorage.setItem(FLASHCARD_DECKS_STORAGE_KEY, JSON.stringify(newDecks));
          } catch (error) {
              console.error("Failed to save decks to localStorage", error);
          }
          return newDecks;
      })
  }, []);

  const studyingDeck = useMemo(() => {
    return savedDecks.find(d => d.id === studyingDeckId) || null;
  }, [savedDecks, studyingDeckId]);
  
  if (studyingDeck) {
    return (
        <div className="flex justify-center animate-fade-in">
            <FlashcardViewer deck={studyingDeck} onBack={() => setStudyingDeckId(null)} onDeckUpdate={handleDeckUpdate} />
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Flashcards</h1>
          <p className="text-muted-foreground">
            Create, manage, and study your flashcard decks.
          </p>
        </div>
      </div>
      
      <form action={formAction} ref={formRef} className="space-y-4">
         <Card>
            <CardHeader>
            <CardTitle>Create New Deck</CardTitle>
            <CardDescription>Give your deck a name, paste text, and choose how many cards to generate with AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="deckName">Deck Name</Label>
                    <Input 
                        id="deckName" 
                        name="deckName" 
                        placeholder="e.g., Biology Chapter 5"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="textContent">Paste your text</Label>
                    <Textarea 
                        id="textContent" 
                        name="textContent" 
                        placeholder="Paste your notes or any text here..."
                        className="min-h-[150px]"
                    />
                </div>
                <div className="grid gap-4">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="numCards">Number of Cards</Label>
                        <Badge variant="outline" className="text-base">{numCards}</Badge>
                    </div>
                    <input type="hidden" name="numCards" value={numCards} />
                    <Slider
                        id="numCardsSlider"
                        name="numCardsSlider"
                        min={4}
                        max={20}
                        step={2}
                        value={[numCards]}
                        onValueChange={(value) => setNumCards(value[0])}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <GenerateButton />
            </CardFooter>
        </Card>
      </form>
      
      <SavedDecks decks={savedDecks} onStudy={setStudyingDeckId} onDelete={handleDeleteDeck} />

      <style jsx>{`
        .perspective-1000 {
            perspective: 1000px;
        }
        .transform-style-preserve-3d {
            transform-style: preserve-3d;
        }
        .rotate-y-180 {
            transform: rotateY(180deg);
        }
        .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
