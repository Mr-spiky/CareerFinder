import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration for Vercel
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app', // Your Vercel frontend URL
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS']
}));

app.use(express.json({ limit: '10mb' }));

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running on Vercel',
    timestamp: new Date().toISOString()
  });
});

// Enhanced mock prediction endpoint (Vercel-compatible)
app.post('/api/predict', async (req, res) => {
  try {
    const { skills, experience, education } = req.body;

    console.log('Raw request body:', req.body); // Add this for debugging

    // Enhanced input validation with type conversion
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array' });
    }
    
    // Convert experience to number if it's a string
    let expValue = experience;
    if (typeof experience === 'string') {
      expValue = parseFloat(experience);
      if (isNaN(expValue)) {
        return res.status(400).json({ error: 'Experience must be a valid number' });
      }
    }
    
    if (typeof expValue !== 'number' || expValue < 0 || expValue > 50) {
      return res.status(400).json({ error: 'Experience must be a number between 0-50' });
    }
    
    if (typeof education !== 'string' || education.trim() === '') {
      return res.status(400).json({ error: 'Education is required' });
    }

    console.log('Processed data:', { skills, experience: expValue, education });

    // Use enhanced mock prediction
    const prediction = getEnhancedAIPrediction(skills, expValue, education);
    const confidence = calculateConfidence(skills, expValue, education);
    
    res.json({
      prediction,
      confidence,
      source: 'AI Algorithm',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed', details: error.message });
  }
});

// Enhanced AI prediction algorithm
function getEnhancedAIPrediction(skills, experience, education) {
  const skillSet = new Set(skills.map(s => s.toLowerCase().trim()));
  const eduLevel = education.toLowerCase();
  
  // Career patterns with weights
  const careerPatterns = [
    {
      name: 'Machine Learning Engineer',
      skills: ['python', 'machine learning', 'tensorflow', 'pytorch', 'ai'],
      education: ['master', 'phd', 'doctoral'],
      experienceThreshold: 2,
      weight: 10
    },
    {
      name: 'Frontend Developer',
      skills: ['javascript', 'react', 'vue', 'angular', 'html', 'css'],
      education: ['bachelor', 'associate'],
      experienceThreshold: 1,
      weight: 8
    },
    {
      name: 'Backend Developer',
      skills: ['node', 'python', 'java', 'c#', 'sql', 'api'],
      education: ['bachelor', 'master'],
      experienceThreshold: 2,
      weight: 9
    },
    {
      name: 'Full Stack Developer',
      skills: ['javascript', 'react', 'node', 'python', 'sql', 'mongodb'],
      education: ['bachelor'],
      experienceThreshold: 3,
      weight: 7
    },
    {
      name: 'Data Scientist',
      skills: ['python', 'r', 'statistics', 'machine learning', 'sql'],
      education: ['master', 'phd'],
      experienceThreshold: 2,
      weight: 9
    },
    {
      name: 'DevOps Engineer',
      skills: ['docker', 'kubernetes', 'aws', 'azure', 'ci/cd'],
      education: ['bachelor', 'master'],
      experienceThreshold: 3,
      weight: 8
    }
  ];

  // Calculate scores for each career
  const careerScores = {};
  
  careerPatterns.forEach(pattern => {
    let score = 0;
    
    // Skill matching
    pattern.skills.forEach(skill => {
      if (Array.from(skillSet).some(s => s.includes(skill) || skill.includes(s))) {
        score += pattern.weight;
      }
    });
    
    // Education bonus
    if (pattern.education.some(edu => eduLevel.includes(edu))) {
      score += 5;
    }
    
    // Experience bonus
    if (experience >= pattern.experienceThreshold) {
      score += (experience - pattern.experienceThreshold) * 2;
    }
    
    careerScores[pattern.name] = score;
  });

  // Find best matching career
  let bestCareer = 'Software Developer';
  let highestScore = 0;
  
  for (const [career, score] of Object.entries(careerScores)) {
    if (score > highestScore) {
      highestScore = score;
      bestCareer = career;
    }
  }

  return bestCareer;
}

function calculateConfidence(skills, experience, education) {
  // Calculate confidence based on input quality
  let confidence = 70; // Base confidence
  
  // More skills = higher confidence
  confidence += Math.min(skills.length * 3, 15);
  
  // Experience adds confidence
  confidence += Math.min(experience * 2, 10);
  
  // Higher education adds confidence
  const eduLevel = education.toLowerCase();
  if (eduLevel.includes('phd') || eduLevel.includes('doctoral')) confidence += 10;
  else if (eduLevel.includes('master')) confidence += 7;
  else if (eduLevel.includes('bachelor')) confidence += 5;
  
  return Math.min(confidence, 95); // Cap at 95%
}

// Vercel serverless function handler
export default app;

// Local development server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  });
}