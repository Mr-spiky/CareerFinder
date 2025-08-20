// api/health.js
import cors from 'cors';

const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'OPTIONS']
});

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await new Promise((resolve, reject) => {
    corsMiddleware(req, res, (err) => {
      if (err) reject(err);
      resolve();
    });
  });

  res.json({ 
    status: 'OK', 
    message: 'Server is running on Vercel',
    timestamp: new Date().toISOString()
  });
}