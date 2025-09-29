
'use server';

/**
 * @fileOverview An AI agent for generating flashcards from text content.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const FlashcardSchema = z.object({
  front: z.string().describe('The front of the flashcard, typically a key term or question.'),
  back: z.string().describe('The back of the flashcard, typically the definition or answer.'),
});
export type Flashcard = z.infer<typeof FlashcardSchema>;


const GenerateFlashcardsInputSchema = z.object({
  content: z.string().describe('The text content to generate flashcards from.'),
  numCards: z.number().default(10).describe('The number of flashcards to generate.'),
  apiKey: z.string().optional().describe('The user provided Gemini API key.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe('An array of generated flashcards.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(
  input: GenerateFlashcardsInput
): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const generateFlashcardsPrompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an expert at creating study materials. Your task is to generate a set of exactly {{{numCards}}} flashcards from the provided text content.

Analyze the following content and identify key terms, concepts, or questions and their corresponding definitions or answers. Create a flashcard for each one.
When analyzing the content, skim and scan for the most relevant information related to study material. You should intelligently ignore extraneous content like school logos, headers, footers, page numbers, or any other non-academic formatting. Focus solely on the substantive educational content.

- The "front" of the card should be a concise term or question.
- The "back" of the card should be its definition or answer.

Generate exactly {{{numCards}}} high-quality flashcards from the content.

Here is the source material:
{{{content}}}

Please provide the output in the specified JSON format. Your response MUST be a valid JSON object matching the output schema.`,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const model = input.apiKey
      ? googleAI.model('gemini-2.5-flash', { apiKey: input.apiKey })
      : 'googleai/gemini-2.5-flash';

    const {output} = await generateFlashcardsPrompt(input, { model });
    
    return output!;
  }
);
