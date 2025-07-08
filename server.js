#!/usr/bin/env node

// Direct deployment server
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint for deployment
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'prompt-roast'
  });
});

// API Routes with mock data for deployment
app.get('/api/prompts', (req, res) => {
  res.json([
    {
      id: '1',
      text: 'Write a haiku about debugging code',
      category: 'creative',
      createdAt: new Date().toISOString()
    },
    {
      id: '2', 
      text: 'Explain quantum computing to a 5-year-old',
      category: 'educational',
      createdAt: new Date().toISOString()
    }
  ]);
});

app.get('/api/prompts/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id: id,
    text: 'Write a haiku about debugging code',
    category: 'creative',
    createdAt: new Date().toISOString()
  });
});

app.post('/api/prompts', (req, res) => {
  const { text, category } = req.body;
  res.json({
    id: Date.now().toString(),
    text: text || 'New prompt',
    category: category || 'general',
    createdAt: new Date().toISOString()
  });
});

app.get('/api/prompts/:promptId/responses', (req, res) => {
  const { promptId } = req.params;
  res.json([
    {
      id: '1',
      promptId: promptId,
      provider: 'gpt',
      response: 'Code errors lurk,\nDebugging through the long night,\nSolution found at dawn.',
      rating: 4,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      promptId: promptId,
      provider: 'claude',
      response: 'Bugs dance in the code,\nPrint statements light the way,\nFixed! Time for coffee.',
      rating: 5,
      createdAt: new Date().toISOString()
    }
  ]);
});

app.post('/api/responses', (req, res) => {
  const { promptId, provider, response } = req.body;
  res.json({
    id: Date.now().toString(),
    promptId: promptId,
    provider: provider,
    response: response,
    rating: 0,
    createdAt: new Date().toISOString()
  });
});

app.patch('/api/responses/:id/rating', (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  res.json({
    id: id,
    rating: rating,
    updatedAt: new Date().toISOString()
  });
});

// Serve static files from the client build directory
const clientPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientPath));

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Start server with proper error handling
const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Prompt Roast server running on http://${HOST}:${PORT}`);
  console.log(`🩺 Health check: http://${HOST}:${PORT}/health`);
  console.log(`📱 Application: http://${HOST}:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});