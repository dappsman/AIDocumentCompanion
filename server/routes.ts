import { Request, Response } from 'express';
import { z } from 'zod';
import { storage } from './storage';
import { insertPromptSchema, insertAiResponseSchema } from '@shared/schema';

export const routes = {
  // Get all prompts
  async getPrompts(req: Request, res: Response) {
    try {
      const prompts = await storage.getPrompts();
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch prompts' });
    }
  },

  // Get a specific prompt
  async getPrompt(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const prompt = await storage.getPrompt(id);
      if (!prompt) {
        return res.status(404).json({ error: 'Prompt not found' });
      }
      res.json(prompt);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch prompt' });
    }
  },

  // Create a new prompt
  async createPrompt(req: Request, res: Response) {
    try {
      const validatedData = insertPromptSchema.parse(req.body);
      const prompt = await storage.createPrompt(validatedData);
      res.status(201).json(prompt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid prompt data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create prompt' });
    }
  },

  // Get AI responses for a prompt
  async getAiResponses(req: Request, res: Response) {
    try {
      const { promptId } = req.params;
      const responses = await storage.getAiResponses(promptId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch AI responses' });
    }
  },

  // Create a new AI response
  async createAiResponse(req: Request, res: Response) {
    try {
      const validatedData = insertAiResponseSchema.parse(req.body);
      const response = await storage.createAiResponse(validatedData);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid AI response data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create AI response' });
    }
  },

  // Update AI response rating
  async updateAiResponseRating(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rating } = req.body;
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      const response = await storage.updateAiResponseRating(id, rating);
      if (!response) {
        return res.status(404).json({ error: 'AI response not found' });
      }
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update rating' });
    }
  },

  // Generate AI responses for a prompt (placeholder - will integrate with actual AI APIs)
  async generateAiResponses(req: Request, res: Response) {
    try {
      const { promptId } = req.params;
      const prompt = await storage.getPrompt(promptId);
      
      if (!prompt) {
        return res.status(404).json({ error: 'Prompt not found' });
      }

      // TODO: Integrate with actual AI APIs (OpenAI, Anthropic, Google)
      // For now, return placeholder responses
      const providers = ['gpt', 'claude', 'gemini'] as const;
      const responses = [];

      for (const provider of providers) {
        const mockResponse = `[${provider.toUpperCase()} Response] This is a placeholder response to: "${prompt.text}". Real AI integration coming soon!`;
        
        const aiResponse = await storage.createAiResponse({
          promptId,
          provider,
          response: mockResponse
        });
        responses.push(aiResponse);
      }

      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate AI responses' });
    }
  }
};