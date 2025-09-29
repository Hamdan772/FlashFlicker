
'use server';
/**
 * @fileOverview A note summarization AI agent.
 *
 * - summarizeNote - A function that handles the note summarization process.
 * - SummarizeNoteInput - The input type for the summarizeNote function.
 * - SummarizeNoteOutput - The return type for the summarizeNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const SummarizeNoteInputSchema = z.object({
  noteContent: z.string().describe('The content of the note to be summarized.'),
  apiKey: z.string().optional().describe('The user provided Gemini API key.'),
});
export type SummarizeNoteInput = z.infer<typeof SummarizeNoteInputSchema>;

const SummarizeNoteOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the provided note content.'),
});
export type SummarizeNoteOutput = z.infer<typeof SummarizeNoteOutputSchema>;

export async function summarizeNote(
  input: SummarizeNoteInput
): Promise<SummarizeNoteOutput> {
  return summarizeNoteFlow(input);
}

const summarizeNotePrompt = ai.definePrompt({
  name: 'summarizeNotePrompt',
  input: {schema: SummarizeNoteInputSchema},
  output: {schema: SummarizeNoteOutputSchema},
  prompt: `You are an expert at summarizing text. Please provide a clear and concise summary of the following note content.
  
When analyzing the content, skim and scan for the most relevant information related to study material. You should intelligently ignore extraneous content like school logos, headers, footers, page numbers, or any other non-academic formatting. Focus solely on the substantive educational content.

{{{noteContent}}}`,
});

const summarizeNoteFlow = ai.defineFlow(
  {
    name: 'summarizeNoteFlow',
    inputSchema: SummarizeNoteInputSchema,
    outputSchema: SummarizeNoteOutputSchema,
  },
  async input => {
    const model = input.apiKey
      ? googleAI.model('gemini-2.5-flash', { apiKey: input.apiKey })
      : 'googleai/gemini-2.5-flash';

    const {output} = await summarizeNotePrompt(input, { model });
    
    return output!;
  }
);
