import { Prompt, AiResponse, InsertPrompt, InsertAiResponse, prompts, aiResponses } from '@shared/schema';
import { db } from './db';
import { eq } from 'drizzle-orm';

export interface IStorage {
  // Prompt operations
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  getPrompts(): Promise<Prompt[]>;
  getPrompt(id: number): Promise<Prompt | null>;
  
  // AI Response operations
  createAiResponse(response: InsertAiResponse): Promise<AiResponse>;
  getAiResponses(promptId: number): Promise<AiResponse[]>;
  updateAiResponseRating(id: number, rating: number): Promise<AiResponse | null>;
}

export class DatabaseStorage implements IStorage {
  async createPrompt(prompt: InsertPrompt): Promise<Prompt> {
    const [newPrompt] = await db
      .insert(prompts)
      .values(prompt)
      .returning();
    return newPrompt;
  }

  async getPrompts(): Promise<Prompt[]> {
    return await db.select().from(prompts);
  }

  async getPrompt(id: number): Promise<Prompt | null> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id));
    return prompt || null;
  }

  async createAiResponse(response: InsertAiResponse): Promise<AiResponse> {
    const [newResponse] = await db
      .insert(aiResponses)
      .values(response)
      .returning();
    return newResponse;
  }

  async getAiResponses(promptId: number): Promise<AiResponse[]> {
    return await db.select().from(aiResponses).where(eq(aiResponses.promptId, promptId));
  }

  async updateAiResponseRating(id: number, rating: number): Promise<AiResponse | null> {
    const [updatedResponse] = await db
      .update(aiResponses)
      .set({ rating })
      .where(eq(aiResponses.id, id))
      .returning();
    return updatedResponse || null;
  }
}

export const storage = new DatabaseStorage();