import readline from 'readline';

import { Stories } from '../src/models/index.js';
import { syncStory } from '../src/processing/index.js';
import { connectDB } from '../src/utils/index.js';

await connectDB();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const id = await new Promise((resolve) => rl.question('storyId: ', resolve));
const story = await Stories.findOne({ id });
await syncStory(story);
process.exit();
