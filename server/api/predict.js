// api/predict.js
import cors from 'cors';

// CORS middleware
const corsMiddleware = cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-app.vercel.app', // Replace with your actual frontend URL
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS']
});

// Enhanced mock prediction function
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
  let confidence = 70;
  confidence += Math.min(skills.length * 3, 15);
  confidence += Math.min(experience * 2, 10);
  
  const eduLevel = education.toLowerCase();
  if (eduLevel.includes('phd') || eduLevel.includes('doctoral')) confidence += 10;
  else if (eduLevel.includes('master')) confidence += 7;
  else if (eduLevel.includes('bachelor')) confidence += 5;
  
  return Math.min(confidence, 95);
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apply CORS
  await new Promise((resolve, reject) => {
    corsMiddleware(req, res, (err) => {
      if (err) reject(err);
      resolve();
    });
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { skills, experience, education } = req.body;

    console.log('Received request:', { skills, experience, education });

    // Input validation
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array' });
    }
    
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

    // Generate prediction
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
}