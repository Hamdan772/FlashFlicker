
import {z} from 'genkit';

export const ExamQuestionSchema = z.object({
  question: z.string().describe('The exam question.'),
  type: z.enum(['mcq', 'text']).describe('The type of question (multiple-choice or free-text).'),
  options: z.array(z.string()).optional().describe('An array of multiple-choice options, if applicable.'),
});
export type ExamQuestion = z.infer<typeof ExamQuestionSchema>;
