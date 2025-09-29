
import { z } from 'zod';

export const quizQuestionSchema = z.object({
    question: z.string(),
    options: z.array(z.string()),
    answer: z.string(),
});

export const quizSchema = z.object({
  topic: z.string().optional(),
  context: z.string().optional(),
  fileDataUris: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  numQuestions: z.number().min(3).max(25),
  apiKey: z.string().optional(),
});

export type QuizState = {
  questions?: z.infer<typeof quizQuestionSchema>[];
  error?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  toast?: {
    title: string;
    description: string;
    variant: 'default' | 'destructive';
  }
};
