import express from 'express';
import cors from 'cors';
import { routes } from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/prompts', routes.getPrompts);
app.get('/api/prompts/:id', routes.getPrompt);
app.post('/api/prompts', routes.createPrompt);
app.get('/api/prompts/:promptId/responses', routes.getAiResponses);
app.post('/api/responses', routes.createAiResponse);
app.patch('/api/responses/:id/rating', routes.updateAiResponseRating);
app.post('/api/prompts/:promptId/generate', routes.generateAiResponses);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});