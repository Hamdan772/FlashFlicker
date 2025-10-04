
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

FORMATTING GUIDELINES:
- Use **bold text** for key concepts and important terms
- Use *italic text* for emphasis
- Use \`code formatting\` for formulas, equations, or specific terminology
- Use numbered lists (1. 2. 3.) for step-by-step explanations
- Use bullet points (- or •) for listing related items
- Use ## for section headers when organizing longer responses
- Use triple backticks \`\`\` for code blocks or longer formulas
- Break up long responses into clear paragraphs with line breaks
- Include examples when explaining concepts

Example formatting:
## Understanding Photosynthesis

**Photosynthesis** is the process where plants convert *light energy* into *chemical energy*. 

The main equation is:
\`6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\`

**Key steps:**
1. **Light-dependent reactions** - occur in thylakoids
2. **Calvin cycle** - occurs in stroma

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
