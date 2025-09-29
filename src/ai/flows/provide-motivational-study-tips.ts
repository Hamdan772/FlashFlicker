
'use server';
/**
 * @fileOverview Provides motivational messages and study tips tailored to the user's performance and goals.
 *
 * - provideMotivationalStudyTips - A function that generates personalized motivational messages and study tips.
 * - ProvideMotivationalStudyTipsInput - The input type for the provideMotivationalStudyTips function.
 * - ProvideMotivationalStudyTipsOutput - The return type for the provideMotivationalStudyTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const ProvideMotivationalStudyTipsInputSchema = z.object({
  performanceSummary: z
    .string()
    .describe(
      'A summary of the user performance, including completed tasks, time spent studying, and areas needing more attention.'
    ),
  learningGoals: z.string().describe('The learning goals of the user.'),
  apiKey: z.string().optional().describe('The user provided Gemini API key.'),
});
export type ProvideMotivationalStudyTipsInput = z.infer<
  typeof ProvideMotivationalStudyTipsInputSchema
>;

const ProvideMotivationalStudyTipsOutputSchema = z.object({
  motivationalMessage: z
    .string()
    .describe('A personalized motivational message for the user.'),
  studyTips: z.string().describe('Tailored study tips for the user.'),
});
export type ProvideMotivationalStudyTipsOutput = z.infer<
  typeof ProvideMotivationalStudyTipsOutputSchema
>;

export async function provideMotivationalStudyTips(
  input: ProvideMotivationalStudyTipsInput
): Promise<ProvideMotivationalStudyTipsOutput> {
  return provideMotivationalStudyTipsFlow(input);
}

const provideMotivationalStudyTipsPrompt = ai.definePrompt({
  name: 'provideMotivationalStudyTipsPrompt',
  input: {schema: ProvideMotivationalStudyTipsInputSchema},
  output: {schema: ProvideMotivationalStudyTipsOutputSchema},
  prompt: `You are a motivational coach specializing in study habits.

You will use the user's performance summary and learning goals to provide a personalized motivational message and tailored study tips.

Performance Summary: {{{performanceSummary}}}
Learning Goals: {{{learningGoals}}}

Provide a motivational message to encourage the user and study tips to help them improve their study habits.`,
});

const provideMotivationalStudyTipsFlow = ai.defineFlow(
  {
    name: 'provideMotivationalStudyTipsFlow',
    inputSchema: ProvideMotivationalStudyTipsInputSchema,
    outputSchema: ProvideMotivationalStudyTipsOutputSchema,
  },
  async input => {
    const model = input.apiKey
      ? googleAI.model('gemini-2.5-flash', { apiKey: input.apiKey })
      : 'googleai/gemini-2.5-flash';

    const {output} = await provideMotivationalStudyTipsPrompt(input, { model });

    return output!;
  }
);
