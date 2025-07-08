import { Prompt, AiResponse, InsertPrompt, InsertAiResponse } from '@shared/schema';

export interface IStorage {
  // Prompt operations
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  getPrompts(): Promise<Prompt[]>;
  getPrompt(id: string): Promise<Prompt | null>;
  
  // AI Response operations
  createAiResponse(response: InsertAiResponse): Promise<AiResponse>;
  getAiResponses(promptId: string): Promise<AiResponse[]>;
  updateAiResponseRating(id: string, rating: number): Promise<AiResponse | null>;
}

export class MemStorage implements IStorage {
  private prompts: Prompt[] = [];
  private aiResponses: AiResponse[] = [];
  private promptIdCounter = 1;
  private responseIdCounter = 1;

  async createPrompt(prompt: InsertPrompt): Promise<Prompt> {
    const newPrompt: Prompt = {
      id: this.promptIdCounter.toString(),
      ...prompt,
      createdAt: new Date(),
    };
    this.promptIdCounter++;
    this.prompts.push(newPrompt);
    return newPrompt;
  }

  async getPrompts(): Promise<Prompt[]> {
    return [...this.prompts];
  }

  async getPrompt(id: string): Promise<Prompt | null> {
    return this.prompts.find(p => p.id === id) || null;
  }

  async createAiResponse(response: InsertAiResponse): Promise<AiResponse> {
    const newResponse: AiResponse = {
      id: this.responseIdCounter.toString(),
      ...response,
      createdAt: new Date(),
    };
    this.responseIdCounter++;
    this.aiResponses.push(newResponse);
    return newResponse;
  }

  async getAiResponses(promptId: string): Promise<AiResponse[]> {
    return this.aiResponses.filter(r => r.promptId === promptId);
  }

  async updateAiResponseRating(id: string, rating: number): Promise<AiResponse | null> {
    const response = this.aiResponses.find(r => r.id === id);
    if (response) {
      response.rating = rating;
      return response;
    }
    return null;
  }
}

export const storage = new MemStorage();