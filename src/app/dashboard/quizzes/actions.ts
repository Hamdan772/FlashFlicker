
'use server';

import { generateQuiz } from '@/ai/flows/generate-quiz';
import { quizSchema, type QuizState } from './definitions';


export async function getQuiz(prevState: QuizState, formData: FormData): Promise<QuizState> {
  const fileDataUrisJson = formData.get('fileDataUris') as string;
  let fileDataUris: string[] = [];
  
  if (fileDataUrisJson) {
    try {
      fileDataUris = JSON.parse(fileDataUrisJson);
    } catch(e) {
      console.error("Failed to parse fileDataUris JSON", e);
      const error = 'There was an issue with the uploaded files. Please try again.';
      return { error, toast: { title: 'Error', description: error, variant: 'destructive'} };
    }
  }
  
  const validatedFields = quizSchema.safeParse({
    topic: formData.get('topic'),
    context: formData.get('context'),
    fileDataUris: fileDataUris,
    difficulty: formData.get('difficulty'),
    numQuestions: Number(formData.get('numQuestions')),
    apiKey: formData.get('apiKey'),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0] || 'Invalid data provided.';
    return {
      error: firstError,
      toast: { title: 'Error', description: firstError, variant: 'destructive'}
    };
  }

  const { topic, context, difficulty, numQuestions, apiKey } = validatedFields.data;

  if (!apiKey) {
    const error = 'Please set your Gemini API key in the header.';
    return { error, toast: { title: 'Error', description: error, variant: 'destructive'} };
  }

  if (!topic && !context && fileDataUris.length === 0) {
    const error = 'Please provide a topic, some text, or upload a file to generate a quiz.';
    return { error, toast: { title: 'Error', description: error, variant: 'destructive'} };
  }

  try {
    const result = await generateQuiz({
        topic: topic || undefined,
        context: context || undefined,
        fileDataUris: fileDataUris,
        difficulty,
        numQuestions,
        apiKey,
    });
    if (result.questions && result.questions.length > 0) {
      return { 
        questions: result.questions,
        topic: topic || 'your content',
        difficulty: difficulty,
      };
    }
    const error = 'Failed to generate a quiz. The AI may not have been able to create questions from the provided content. Please try again.';
    return { error, toast: { title: 'Error', description: error, variant: 'destructive'} };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    let friendlyMessage = `An unexpected error occurred. Details: ${errorMessage}`;
    if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota')) {
        friendlyMessage = 'Your API key has exceeded its quota. Please check your usage or try again later.';
    }
    return { error: friendlyMessage, toast: { title: 'Error', description: friendlyMessage, variant: 'destructive'} };
  }
}
