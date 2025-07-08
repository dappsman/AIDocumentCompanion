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
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 80,
    environment: process.env.NODE_ENV || 'development'
  });
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
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 80;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Prompt Roast server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Serving client from: ${clientDistPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});