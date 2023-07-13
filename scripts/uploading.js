import { uploadToYoutubeCron } from '../src/cronJob/index.js';
import { connectDB } from '../src/utils/index.js';

await connectDB();
await uploadToYoutubeCron();
process.exit();
