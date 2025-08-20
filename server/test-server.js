import express from 'express';
import cors from 'cors';

const app = express();

// Ultra-simple CORS
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'OPTIONS']
}));

// Basic middleware
app.use(express.json());

// Simple health endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check received!');
  res.json({ status: 'OK', message: 'Server is working' });
});

// Test prediction endpoint
app.post('/api/predict', (req, res) => {
  console.log('Prediction request received:', req.body);
  res.json({ 
    prediction: 'Test Career', 
    source: 'Test Server',
    data: req.body 
  });
});

// Start server
const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`✅ Test with: curl http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  console.error('❌ Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log('Port 3001 is busy. Trying port 3002...');
    app.listen(3002, '0.0.0.0', () => {
      console.log(`✅ Server running on port 3002`);
    });
  }
});