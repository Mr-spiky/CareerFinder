// test_model.js
import * as ort from 'onnxruntime-node';
import { readFileSync } from 'fs';

const model = readFileSync('adv_inception_v3_Opset16 .onnx');
const session = await ort.InferenceSession.create(model);
console.log('Input names:', session.inputNames);
console.log('Input dimensions:', session.inputDimensions);