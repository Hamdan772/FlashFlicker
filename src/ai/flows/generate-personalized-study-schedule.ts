
'use server';

/**
 * @fileOverview A personalized study schedule generator.
 *
 * - generatePersonalizedStudySchedule - A function that handles the study schedule generation process.
 * - GeneratePersonalizedStudyScheduleInput - The input type for the generatePersonalizedStudySchedule function.
 * - GeneratePersonalizedStudyScheduleOutput - The return type for the generatePersonalizedStudySchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const GeneratePersonalizedStudyScheduleInputSchema = z.object({
  courses: z
    .string()
    .describe('List of courses the student is taking, separated by commas.'),
  deadlines: z
    .string()
    .describe(
      'List of deadlines for each course, separated by commas. Use the format YYYY-MM-DD for each deadline.'
    ),
  commitments: z
    .string()
    .describe(
      'List of personal commitments, separated by commas. Include the time and day of the week for each commitment.'
    ),
  apiKey: z.string().optional().describe('The user provided Gemini API key.'),
});
export type GeneratePersonalizedStudyScheduleInput = z.infer<
  typeof GeneratePersonalizedStudyScheduleInputSchema
>;

const GeneratePersonalizedStudyScheduleOutputSchema = z.object({
  schedule: z
    .string()
    .describe('A personalized study schedule based on the courses, deadlines, and commitments.'),
});
export type GeneratePersonalizedStudyScheduleOutput = z.infer<
  typeof GeneratePersonalizedStudyScheduleOutputSchema
>;

export async function generatePersonalizedStudySchedule(
  input: GeneratePersonalizedStudyScheduleInput
): Promise<GeneratePersonalizedStudyScheduleOutput> {
  return generatePersonalizedStudyScheduleFlow(input);
}

const generatePersonalizedStudySchedulePrompt = ai.definePrompt({
  name: 'generatePersonalizedStudySchedulePrompt',
  input: {schema: GeneratePersonalizedStudyScheduleInputSchema},
  output: {schema: GeneratePersonalizedStudyScheduleOutputSchema},
  prompt: `You are a personal study schedule assistant. Your goal is to create a personalized study schedule based on the courses, deadlines, and commitments provided.

Courses: {{{courses}}}
Deadlines: {{{deadlines}}}
Commitments: {{{commitments}}}

Create a detailed study schedule that takes into account all of the above information. Make sure to allocate enough time for each course, and to schedule study sessions around the student's commitments.

Output the schedule in plain text.`,
});

const generatePersonalizedStudyScheduleFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedStudyScheduleFlow',
    inputSchema: GeneratePersonalizedStudyScheduleInputSchema,
    outputSchema: GeneratePersonalizedStudyScheduleOutputSchema,
  },
  async input => {
    const model = input.apiKey
      ? googleAI.model('gemini-2.5-flash', { apiKey: input.apiKey })
      : 'googleai/gemini-2.5-flash';

    const {output} = await generatePersonalizedStudySchedulePrompt(input, { model });

    return output!;
  }
);
