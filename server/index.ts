import express from 'express';
import cors from 'cors';
import path from 'path';
import { routes } from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint for deployment
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/prompts', routes.getPrompts);
app.get('/api/prompts/:id', routes.getPrompt);
app.post('/api/prompts', routes.createPrompt);
app.get('/api/prompts/:promptId/responses', routes.getAiResponses);
app.post('/api/responses', routes.createAiResponse);
app.patch('/api/responses/:id/rating', routes.updateAiResponseRating);
app.post('/api/prompts/:promptId/generate', routes.generateAiResponses);

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 80;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});