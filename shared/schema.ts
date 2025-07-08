import { pgTable, text, integer, timestamp, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

// Define the database tables
export const prompts = pgTable('prompts', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  category: text('category'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiResponses = pgTable('ai_responses', {
  id: serial('id').primaryKey(),
  promptId: integer('prompt_id').references(() => prompts.id).notNull(),
  provider: text('provider', { enum: ['gpt', 'claude', 'gemini'] }).notNull(),
  response: text('response').notNull(),
  rating: integer('rating'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relations
export const promptsRelations = relations(prompts, ({ many }) => ({
  aiResponses: many(aiResponses),
}));

export const aiResponsesRelations = relations(aiResponses, ({ one }) => ({
  prompt: one(prompts, {
    fields: [aiResponses.promptId],
    references: [prompts.id],
  }),
}));

// Insert schemas (omitting auto-generated fields)
export const insertPromptSchema = createInsertSchema(prompts).omit({ id: true, createdAt: true });
export const insertAiResponseSchema = createInsertSchema(aiResponses).omit({ id: true, createdAt: true });

// Types
export type Prompt = typeof prompts.$inferSelect;
export type AiResponse = typeof aiResponses.$inferSelect;
export type InsertPrompt = typeof insertPromptSchema._input;
export type InsertAiResponse = typeof insertAiResponseSchema._input;

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