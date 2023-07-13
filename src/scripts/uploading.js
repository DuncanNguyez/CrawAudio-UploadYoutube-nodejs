import { uploadToYoutubeCron } from '../cronJob/index.js';

await uploadToYoutubeCron();
process.exit();
