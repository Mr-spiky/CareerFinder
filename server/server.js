import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import * as ort from 'onnxruntime-node';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Request logging middleware with response tracking
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS']
}));

// Preflight handler
app.options('/api/predict', cors());

// JSON body parser with limit
app.use(express.json({ limit: '10kb' }));

// Redis Client Configuration
const redisClient = createClient({
  url: 'redis://localhost:6379'
});

redisClient.on('error', err => console.error('Redis Client Error:', err));

// Career Prediction Model Configuration
let inferenceSession = null;
let modelInputShape = [1, 7]; // Updated default to 7 features
let modelInputName = '';
let modelFeatures = null;

// Initialize Redis and Model
(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis Connected!');

    // Try loading career prediction model
    try {
      const modelPath = path.join(__dirname, 'career_model.onnx');

      if (!existsSync(modelPath)) {
        console.warn('⚠️ Career model file not found. Using mock predictions.');
        return;
      }

      const modelBuffer = readFileSync(modelPath);
      inferenceSession = await ort.InferenceSession.create(modelBuffer);
      console.log('✅ Career model loaded successfully!');

      // SAFELY GET MODEL INPUT NAME AND SHAPE
      if (inferenceSession.inputNames.length > 0) {
        // Debug: Log all available input names
        console.log('Available input names:', inferenceSession.inputNames);

        // Find input name (case-insensitive search)
        modelInputName = inferenceSession.inputNames.find(name =>
          name.toLowerCase().includes('input') || name.toLowerCase().includes('feature')
        );

        // Fallback to first input name if not found
        if (!modelInputName) {
          modelInputName = inferenceSession.inputNames[0];
          console.warn(`⚠️ Default input name not found. Using first input: ${modelInputName}`);
        }

        console.log('Using input name:', modelInputName);

        // Get input shape from descriptors
        if (inferenceSession.inputDescriptors instanceof Map) {
          const inputDescriptor = inferenceSession.inputDescriptors.get(modelInputName);

          if (inputDescriptor && Array.isArray(inputDescriptor.dims)) {
            modelInputShape = inputDescriptor.dims;
            console.log('Model expects input shape:', modelInputShape);
          } else {
            // Fallback: Get shape from model metadata
            try {
              const modelMetadata = inferenceSession.modelMetadata;
              if (modelMetadata && modelMetadata.inputs) {
                const inputMeta = modelMetadata.inputs.find(i => i.name === modelInputName);
                if (inputMeta && inputMeta.shape) {
                  modelInputShape = inputMeta.shape.dims;
                  console.log('Using shape from metadata:', modelInputShape);
                }
              }
            } catch (metaErr) {
              console.warn('⚠️ Could not get shape from metadata:', metaErr.message);
            }
          }
        } else {
          console.warn('⚠️ inputDescriptors is not a Map');
        }

        // Final fallback if shape still not set
        if (!modelInputShape || modelInputShape.length === 0) {
          console.warn('⚠️ Using default input shape [1, 5]');
          modelInputShape = [1, 5];
        }
      } else {
        console.warn('⚠️ No input names found in model');
      }
    } catch (modelErr) {
      console.error('❌ Model loading failed:', modelErr.message);
      console.warn('⚠️ Falling back to mock predictions');
    }
  } catch (err) {
    console.error('❌ Initialization failed:', err);
  }
})();

// Career Prediction Endpoint
app.post('/api/predict', async (req, res) => {
  console.log("Received prediction request:", req.body);
  try {
    const { skills, experience, education } = req.body;

    // Enhanced input validation
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ error: 'Skills array required with at least one skill' });
    }
    if (typeof experience !== 'number' || experience < 0 || experience > 50) {
      return res.status(400).json({ error: 'Experience must be a number between 0-50 years' });
    }
    if (typeof education !== 'string' || education.trim() === '') {
      return res.status(400).json({ error: 'Valid education level required' });
    }

    // Prepare model input with feature validation
    const { inputTensor, usedFeatures } = prepareCareerInput(skills, experience, education);
    console.log('Generated input tensor:', inputTensor);

    // Validate feature vector length
    if (inputTensor.length !== modelInputShape[1]) {
      console.warn(`⚠️ Feature vector length mismatch! Expected ${modelInputShape[1]}, got ${inputTensor.length}`);
    }

    // Try real model prediction if available
    if (inferenceSession && modelInputName) {
      try {
        const tensor = new ort.Tensor('float32', inputTensor, modelInputShape);

        const feeds = { [modelInputName]: tensor };
        const results = await inferenceSession.run(feeds);

        const outputName = inferenceSession.outputNames[0];
        const outputTensor = results[outputName];

        const prediction = interpretPrediction(outputTensor.data, outputTensor.dims);
        return res.json({
          prediction,
          source: 'AI Model',
          features: usedFeatures
        });
      } catch (modelErr) {
        console.error('❌ Model prediction failed:', modelErr);
        // Fall through to mock prediction
      }
    }

    // Fallback to mock prediction
    console.warn('⚠️ Using mock prediction');
    const mockPrediction = getMockPrediction(skills, experience, education);
    return res.json({
      prediction: mockPrediction,
      source: 'Mock Data',
      warning: 'Model not available - using mock results'
    });

  } catch (err) {
    console.error('❌ Prediction error:', err);
    res.status(500).json({
      error: 'Prediction failed',
      details: err.message
    });
  }
});

// Helper Functions - Improved for accuracy
function prepareCareerInput(skills, experience, education) {
  // Define feature set - prioritize config if available
  const featureSkills = modelFeatures?.skillSet || [
    'javascript', 'python', 'machine learning', 'react',
    'data analysis', 'cloud', 'sql'
  ];

  // Create skill vector
  const skillVector = featureSkills.map(skill =>
    skills.some(s => s.toLowerCase().includes(skill.toLowerCase())) ? 1 : 0
  );

  // Enhanced education encoding
  const educationMap = {
    'high school': 0.0,
    'associate': 0.25,
    'bachelor': 0.5,
    'master': 0.75,
    'phd': 1.0,
    'doctoral': 1.0
  };

  const educationLevel = educationMap[education.toLowerCase()] || 0.3;

  // Experience scaling with logarithmic transformation
  const expScaled = Math.log1p(experience) / Math.log1p(30);

  // Create full feature vector
  const features = [
    ...skillVector,
    expScaled,
    educationLevel
  ];

  return {
    inputTensor: new Float32Array(features),
    usedFeatures: featureSkills
  };
}

function interpretPrediction(outputData, outputShape) {
  // Career mappings with priorities
  const careerMap = {
    0: 'Frontend Developer',
    1: 'Data Scientist',
    2: 'Machine Learning Engineer',
    3: 'DevOps Engineer',
    4: 'Full Stack Developer',
    5: 'Data Analyst',
    6: 'Cloud Architect'
  };

  // Handle multi-dimensional outputs
  let scores;
  if (outputShape.length === 2) {
    scores = Array.from(outputData);
  } else if (outputShape.length === 1) {
    scores = Array.from(outputData);
  } else {
    // Handle 3D output [batch, sequence, features]
    scores = Array.from(outputData).slice(-careerMap.length);
  }

  // Find best prediction
  let maxIndex = 0;
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > scores[maxIndex]) {
      maxIndex = i;
    }
  }

  return careerMap[maxIndex] || 'Technology Specialist';
}

function getMockPrediction(skills, experience, education) {
  // Skill-based prediction weights
  const skillWeights = {
    'javascript': { 'Frontend Developer': 0.8, 'Full Stack Developer': 0.6 },
    'python': { 'Data Scientist': 0.9, 'Machine Learning Engineer': 0.7 },
    'machine learning': { 'Machine Learning Engineer': 0.95, 'Data Scientist': 0.8 },
    'react': { 'Frontend Developer': 0.85 },
    'cloud': { 'DevOps Engineer': 0.75, 'Cloud Architect': 0.9 },
    'sql': { 'Data Analyst': 0.85, 'Data Scientist': 0.6 }
  };

  // Calculate career scores
  const careerScores = {};
  skills.forEach(skill => {
    const skillKey = skill.toLowerCase();
    for (const [career, weight] of Object.entries(skillWeights[skillKey] || {})) {
      careerScores[career] = (careerScores[career] || 0) + weight;
    }
  });

  // Apply experience modifier
  Object.keys(careerScores).forEach(career => {
    careerScores[career] *= 1 + Math.min(experience / 10, 1);
  });

  // Apply education modifier
  const eduModifier = education.includes('master') || education.includes('phd')
    ? 1.2 : 1.0;
  Object.keys(careerScores).forEach(career => {
    careerScores[career] *= eduModifier;
  });

  // Find best career match
  let bestCareer = 'Full Stack Developer';
  let bestScore = 0;
  for (const [career, score] of Object.entries(careerScores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCareer = career;
    }
  }

  return bestCareer;
}

// Server Startup
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});