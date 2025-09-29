
'use client';

import { useActionState, useEffect, useState, useRef, useTransition } from 'react';
import { getQuiz } from './actions';
import { type QuizState } from './definitions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Wand2, CheckCircle, XCircle, Upload, File, X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApiKey } from '@/hooks/use-api-key';
import { useGamification } from '@/hooks/use-gamification';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';


function QuizQuestion({ question, index, onAnswer, selectedOption, submitted }: { question: NonNullable<QuizState['questions']>[0], index: number, onAnswer: (questionIndex: number, option: string) => void, selectedOption?: string, submitted: boolean }) {
  const isCorrect = submitted && selectedOption === question.answer;
  const isIncorrect = submitted && selectedOption && selectedOption !== question.answer;

  return (
    <Card key={index} className={cn(
      "transition-all duration-300 ease-in-out",
      isCorrect && 'border-green-500',
      isIncorrect && 'border-red-500'
    )}>
      <CardHeader>
        <CardTitle>Question {index + 1}</CardTitle>
        <CardDescription>{question.question}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={(value) => onAnswer(index, value)} disabled={submitted} value={selectedOption}>
          {question.options.map((option, i) => (
            <div key={i} className={cn(
              "flex items-center space-x-2 p-3 rounded-md border",
              submitted && option === question.answer && 'bg-green-100 dark:bg-green-900',
              submitted && option === selectedOption && option !== question.answer && 'bg-red-100 dark:bg-red-900',
            )}>
              <RadioGroupItem value={option} id={`q${index}-option${i}`} />
              <Label htmlFor={`q${index}-option${i}`}>{option}</Label>
              {submitted && option === question.answer && <CheckCircle className="ml-auto h-5 w-5 text-green-600" />}
              {submitted && option === selectedOption && option !== question.answer && <XCircle className="ml-auto h-5 w-5 text-red-600" />}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

const initialState: QuizState = { questions: undefined, error: undefined, topic: undefined, difficulty: undefined };

export default function QuizzesPage() {
  const { logAction, addXp } = useGamification();
  const { apiKey, isKeySet } = useApiKey();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [numQuestions, setNumQuestions] = useState(10);
  
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  
  const { toast } = useToast();
  
  const [state, formAction] = useActionState(getQuiz, initialState);

  useEffect(() => {
    if (state.toast) {
      toast(state.toast);
    }
  }, [state.toast, toast]);
  

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if(state.questions) {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
        setUploadedFiles([]);
        if (formRef.current) {
          formRef.current.reset();
        }
         if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setNumQuestions(10);
        logAction('generateQuiz');
    }
  }, [state.questions, logAction]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        const files = Array.from(event.target.files);
        setUploadedFiles(prev => [...prev, ...files]);
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
  
  const handleGenerateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    startTransition(async () => {
         if (!isKeySet) {
            toast({ title: 'Error', description: 'Please set your Gemini API key to generate a quiz.', variant: 'destructive' });
            return;
        }

        const fileToDataURI = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
        }

        let dataUris: string[] = [];
        if (uploadedFiles.length > 0) {
            try {
                dataUris = await Promise.all(uploadedFiles.map(fileToDataURI));
            } catch(e) {
                console.error("Failed to convert files to data URIs", e);
                toast({ title: 'Error', description: 'Could not process one or more files.', variant: 'destructive'});
                return;
            }
        }
        
        const formData = new FormData(form);
        const topic = formData.get('topic') as string;
        const context = formData.get('context') as string;

        if (!topic && !context && dataUris.length === 0) {
            toast({ title: 'Error', description: 'Please provide a topic, some text, or upload a file to generate a quiz.', variant: 'destructive' });
            return;
        }
        
        formData.append('apiKey', apiKey);
        formData.append('numQuestions', numQuestions.toString());
        formData.append('fileDataUris', JSON.stringify(dataUris));

        formAction(formData);
    });
  }

  const handleAnswerChange = (questionIndex: number, option: string) => {
    setAnswers(prev => ({...prev, [questionIndex]: option}));
  };

  const handleSubmitQuiz = () => {
    if (!state.questions) return;
    let correctCount = 0;
    state.questions.forEach((q, i) => {
      if (answers[i] === q.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
    const earnedXp = correctCount * 10;
    if (earnedXp > 0) {
        addXp(earnedXp);
        toast({ title: 'Quiz Submitted!', description: `You earned ${earnedXp} XP!` });
    } else {
        toast({ title: 'Quiz Submitted!', description: `Better luck next time!` });
    }
  };
  
  const resetQuiz = () => {
    formAction(initialState as FormData);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Quiz Generator</h1>
        <p className="text-muted-foreground">
          Create AI-powered quizzes to test your knowledge.
        </p>
      </div>
      
      {!state.questions && (
       <form ref={formRef} onSubmit={handleGenerateSubmit} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>1. Create a Quiz from Topic or Text</CardTitle>
                    <CardDescription>Enter a topic, paste text, and select a difficulty to generate a quiz.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="topic">Topic (Optional)</Label>
                        <Input id="topic" name="topic" placeholder="e.g., The Renaissance, Quantum Physics" disabled={isPending} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="context">Text (Optional)</Label>
                        <Textarea id="context" name="context" placeholder="Paste text here to generate a quiz from it." className="min-h-[150px]" disabled={isPending}/>
                    </div>
                </CardContent>
            </Card>
        
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
            </div>

            <Card>
                <CardHeader>
                <CardTitle>2. Create a Quiz from Files</CardTitle>
                <CardDescription>Upload one or more documents to automatically generate a quiz with AI.</CardDescription>
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
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(file.name)} disabled={isPending}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full mt-4" onClick={openFileDialog} type="button" disabled={isPending}>
                            <Upload className="mr-2" />
                            Add more files...
                        </Button>
                    </div>
                ) : (
                    <div 
                    className={cn("border-2 border-dashed border-muted rounded-lg p-12 flex flex-col items-center justify-center transition-colors", !isPending && "cursor-pointer hover:bg-muted/50")}
                    onClick={!isPending ? openFileDialog : undefined}
                    >
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Drag & drop files here or click to browse</p>
                    <Button className="mt-4 pointer-events-none" variant="outline" type="button">
                        <Upload className="mr-2" />
                        Import from File(s)
                    </Button>
                    </div>
                )}
                <input 
                    id="file-upload-quiz"
                    ref={fileInputRef}
                    type="file"
                    name="files"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt"
                    disabled={isPending}
                />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>3. Configure Quiz</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select name="difficulty" defaultValue="medium" disabled={isPending}>
                            <SelectTrigger id="difficulty">
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="numQuestions">Number of Questions</Label>
                            <Badge variant="outline" className="text-base">{numQuestions}</Badge>
                        </div>
                        <Slider
                            id="numQuestionsSlider"
                            name="numQuestionsSlider"
                            min={3}
                            max={25}
                            step={1}
                            value={[numQuestions]}
                            onValueChange={(value) => setNumQuestions(value[0])}
                            disabled={isPending}
                        />
                    </div>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>4. Generate!</CardTitle>
                    <CardDescription>Click the button below to generate your customized quiz.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? <Loader2 className="animate-spin mr-2"/> : <Wand2 className="mr-2" />}
                        {isPending ? 'Generating Quiz...' : 'Generate Quiz'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
      )}

      {state.questions && !isPending && (
        <div className="space-y-6 animate-fade-in">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                       <span>Quiz on {state.topic || 'Your Uploaded Content'}</span>
                       <Badge variant="outline" className="capitalize">{state.difficulty}</Badge>
                    </CardTitle>
                    <CardDescription>
                        Answer the questions below to test your knowledge.
                    </CardDescription>
                </CardHeader>
                 <CardFooter className="flex-wrap gap-4">
                     <Button onClick={handleSubmitQuiz} className="w-full sm:w-auto" disabled={submitted}>
                        {submitted ? 'Quiz Submitted!' : 'Submit Quiz'}
                     </Button>
                     <Button onClick={resetQuiz} variant="secondary" className="w-full sm:w-auto">
                        Create New Quiz
                    </Button>
                </CardFooter>
            </Card>

            <div className="space-y-4">
                {state.questions.map((q, i) => (
                    <QuizQuestion 
                        key={i} 
                        question={q} 
                        index={i} 
                        onAnswer={handleAnswerChange}
                        selectedOption={answers[i]}
                        submitted={submitted}
                    />
                ))}
            </div>

            {submitted && (
              <Card className="animate-pop-in">
                <CardHeader>
                  <CardTitle>Quiz Complete!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">You scored {score} out of {state.questions.length}!</p>
                  <p className="text-4xl font-bold my-2">
                        {state.questions.length > 0 ? Math.round((score / state.questions.length) * 100) : 0}%
                  </p>
                </CardContent>
              </Card>
            )}
        </div>
      )}
    </div>
  );
}
