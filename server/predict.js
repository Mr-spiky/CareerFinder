import { createClient } from 'redis';
import * as ort from 'onnxruntime-node';

const client = createClient({ 
  url: 'redis://localhost:6379' 
});

// Connect to Redis when module is loaded
(async () => {
  try {
    await client.connect();
    console.log('✅ Redis Connected in predict.js');
  } catch (err) {
    console.error('❌ Redis Connection Failed:', err);
  }
})();

export async function predictCareer(inputTensor) {
  try {
    // Load model from Redis
    const modelBase64 = await client.get('model:career_predictor');
    if (!modelBase64) {
      throw new Error('Model not found in Redis');
    }
    
    const modelBuffer = Buffer.from(modelBase64, 'base64');
    const session = await ort.InferenceSession.create(modelBuffer);
    
    // Get model input details
    const inputName = session.inputNames[0];
    const inputShape = session.inputDimensions[inputName];
    
    // Create tensor with proper shape
    const tensor = new ort.Tensor('float32', inputTensor, inputShape);
    
    const results = await session.run({ [inputName]: tensor });
    return results[session.outputNames[0]].data;
    
  } catch (err) {
    console.error('Prediction failed:', err);
    throw err;
  }
}

export function interpretPrediction(output) {
  const careers = [
    'Software Engineer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Web Developer',
    'DevOps Engineer',
    'UI/UX Designer'
  ];
  
  // Find index with highest probability
  let maxIndex = 0;
  for (let i = 1; i < output.length; i++) {
    if (output[i] > output[maxIndex]) {
      maxIndex = i;
    }
  }
  
  return careers[maxIndex] || 'Technology Specialist';
}