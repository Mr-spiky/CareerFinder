import { readFileSync, existsSync } from 'fs';
import { createClient } from 'redis';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  url: 'redis://localhost:6379'
});

async function uploadModel() {
  try {
    const modelPath = path.join(__dirname, 'career_model.onnx'); // Use career model
    console.log('Model path:', modelPath);
    console.log('File exists:', existsSync(modelPath));

    if (!existsSync(modelPath)) {
      throw new Error(`Model not found at ${modelPath}`);
    }

    const modelBuffer = readFileSync(modelPath);
    const modelBase64 = modelBuffer.toString('base64');
    const sizeMB = (modelBuffer.length / (1024 * 1024)).toFixed(2);
    console.log(`Model size: ${sizeMB} MB`);

    // Upload to Redis as base64
    await client.set('model:career_predictor', modelBase64);
    console.log('✅ Model uploaded as base64!');

    // Verify storage
    const stored = await client.get('model:career_predictor');
    const storedSizeMB = (Buffer.byteLength(stored) / (1024 * 1024)).toFixed(2);
    console.log(`Stored model size: ${storedSizeMB} MB`);

    // Size verification
    if (Math.abs(parseFloat(storedSizeMB) - parseFloat(sizeMB) > 0.1)) {
      console.warn('⚠️ Size mismatch! Redis storage may be corrupted');
    } else {
      console.log('✅ Size verification passed');
    }

  } catch (err) {
    console.error('❌ Upload failed:', err);
  }
}

(async () => {
  try {
    await client.connect();
    console.log('✅ Redis Connected - Ready for Model Upload');
    
    // Check if model exists
    const existing = await client.exists('model:career_predictor');
    if (existing) {
      console.log('⚠️ Model already exists in Redis. Overwriting...');
    }
    
    await uploadModel();
  } catch (err) {
    console.error('❌ Redis Connection Failed:', err);
  } finally {
    if (client.isOpen) {
      await client.quit();
      console.log('Redis connection closed');
    }
  }
})();