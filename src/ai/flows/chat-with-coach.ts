
'use server';
/**
 * @fileOverview An AI agent for conversational coaching based on user notes.
 *
 * - chatWithCoach - A function that handles the chat interaction.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import type { ChatWithCoachInput, ChatWithCoachOutput } from '@/app/dashboard/coach/definitions';
import { ChatWithCoachInputSchema, ChatWithCoachOutputSchema } from '@/app/dashboard/coach/definitions';

export async function chatWithCoach(
  input: ChatWithCoachInput
): Promise<ChatWithCoachOutput> {
  return chatWithCoachFlow(input);
}

const chatWithCoachPrompt = ai.definePrompt({
  name: 'chatWithCoachPrompt',
  input: {schema: ChatWithCoachInputSchema},
  output: {schema: ChatWithCoachOutputSchema},
  prompt: `You are an expert study coach. Your role is to help the user understand their study materials.

You will be given the user's current question and the conversation history.
{{#if noteContext}}
You have also been provided with the content of a specific note to use as the primary context for your answers.
Here is the note content:
---
{{{noteContext}}}
---
{{/if}}

Based on this information, answer the user's question. Be encouraging and break down complex topics into simple, understandable parts.

The conversation history is provided as a JSON array of objects, where each object has a "role" ('user' or 'assistant') and "content".
Conversation History:
{{{json history}}}

User's new message: {{{message}}}

Your reply must be a valid JSON object matching the output schema.`,
});

const chatWithCoachFlow = ai.defineFlow(
  {
    name: 'chatWithCoachFlow',
    inputSchema: ChatWithCoachInputSchema,
    outputSchema: ChatWithCoachOutputSchema,
  },
  async input => {
    const model = input.apiKey
      ? googleAI.model('gemini-2.5-flash', { apiKey: input.apiKey })
      : 'googleai/gemini-2.5-flash';

    const {output} = await chatWithCoachPrompt(input, { model });
    
    return output!;
  }
);
