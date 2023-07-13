import { uploadToYoutubeCron } from '../src/cronJob/index.js';

await uploadToYoutubeCron();
process.exit();
