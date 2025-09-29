import { z } from 'zod';

/**
 * @fileOverview Schema and type definitions for the AI Study Coach feature.
 */

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatWithCoachInputSchema = z.object({
  message: z.string().describe("The user's latest message."),
  history: z.array(ChatMessageSchema).optional().describe('The conversation history.'),
  noteContext: z.string().optional().describe('The content of the selected note for context.'),
  apiKey: z.string().optional().describe('The user provided Gemini API key.'),
});
export type ChatWithCoachInput = z.infer<typeof ChatWithCoachInputSchema>;

export const ChatWithCoachOutputSchema = z.object({
  reply: z.string().describe("The AI coach's reply to the user."),
});
export type ChatWithCoachOutput = z.infer<typeof ChatWithCoachOutputSchema>;
