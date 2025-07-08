import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

// Define the data model for prompts and AI responses
export const promptSchema = z.object({
  id: z.string(),
  text: z.string(),
  category: z.string().optional(),
  createdAt: z.date(),
});

export const aiResponseSchema = z.object({
  id: z.string(),
  promptId: z.string(),
  provider: z.enum(['gpt', 'claude', 'gemini']),
  response: z.string(),
  rating: z.number().min(1).max(5).optional(),
  createdAt: z.date(),
});

// Insert schemas (omitting auto-generated fields)
export const insertPromptSchema = promptSchema.omit({ id: true, createdAt: true });
export const insertAiResponseSchema = aiResponseSchema.omit({ id: true, createdAt: true });

// Types
export type Prompt = z.infer<typeof promptSchema>;
export type AiResponse = z.infer<typeof aiResponseSchema>;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type InsertAiResponse = z.infer<typeof insertAiResponseSchema>;

// Pre-defined creative prompts for the roast platform
export const defaultPrompts = [
  {
    text: "Write a breakup letter to humanity from AI in the tone of a petty ex.",
    category: "humor"
  },
  {
    text: "Explain quantum physics as if you're a frustrated teacher whose students keep asking 'but why?'",
    category: "educational"
  },
  {
    text: "Write a Yelp review for Earth from the perspective of an alien tourist.",
    category: "creative"
  },
  {
    text: "Create a LinkedIn post about being unemployed, but make it sound like a flex.",
    category: "social"
  },
  {
    text: "Write a customer service script for a company that sells existential dread.",
    category: "humor"
  }
];