import readline from 'readline';
import { handleUpload } from '../src/cronJob/services/index.js';
import { Stories } from '../src/models/index.js';
import { connectDB } from '../src/utils/index.js';

await connectDB();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const id = await new Promise((resolve) => rl.question('storyId', resolve));

const stories = await Stories.findOne({ id }).lean();
await handleUpload(stories);

process.exit();
