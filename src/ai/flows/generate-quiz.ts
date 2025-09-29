
'use server';

/**
 * @fileOverview An AI agent for generating quizzes.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('An array of 4 plausible multiple-choice options.'),
  answer: z.string().describe('The correct answer to the question.'),
});

const GenerateQuizInputSchema = z.object({
  topic: z.string().optional().describe('The topic for the quiz.'),
  context: z.string().optional().describe('Text context to generate the quiz from.'),
  fileDataUris: z.array(z.string()).optional().describe('Array of file data URIs to generate the quiz from.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium').describe('The difficulty level of the quiz.'),
  numQuestions: z.number().default(5).describe('The number of questions to generate.'),
  apiKey: z.string().optional().describe('The user provided Gemini API key.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('An array of generated quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(
  input: GenerateQuizInput
): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert at creating quizzes. Your task is to generate a quiz with exactly {{{numQuestions}}} questions.

You will be given a topic, context, or file(s) to generate the quiz from. Use the provided material as the primary source. If multiple sources are provided, synthesize them.
When analyzing any provided documents or text, skim and scan for the most relevant information related to study material. You should intelligently ignore extraneous content like school logos, headers, footers, page numbers, or any other non-academic formatting. Focus solely on the substantive educational content.

The quiz difficulty should be {{{difficulty}}}.

For each question, you must provide:
1.  A clear question.
2.  A set of exactly 4 plausible multiple-choice options.
3.  The correct answer from the provided options.

Here is the source material:
{{#if topic}}
  Topic: {{{topic}}}
{{/if}}
{{#if context}}
  Context: {{{context}}}
{{/if}}
{{#if fileDataUris}}
  {{#each fileDataUris}}
    File Content: {{media url=this}}
  {{/each}}
{{/if}}

Please generate exactly {{{numQuestions}}} questions and provide the output in the specified JSON format. Your response MUST be a valid JSON object matching the output schema.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const model = input.apiKey
      ? googleAI.model('gemini-2.5-flash', { apiKey: input.apiKey })
      : 'googleai/gemini-2.5-flash';

    const {output} = await generateQuizPrompt(input, { model });

    return output!;
  }
);
