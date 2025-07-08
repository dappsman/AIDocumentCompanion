const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint for deployment
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Simple API Routes with placeholder data
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
    id: '3',
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