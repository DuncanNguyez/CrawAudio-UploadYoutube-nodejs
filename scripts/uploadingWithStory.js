import { handleUpload } from '../src/cronJob/services/index.js';
import { Stories } from '../src/models/index.js';
import { connectDB } from '../src/utils/index.js';

await connectDB();
const id = process.argv[2];
const stories = await Stories.findOne({ id }).lean();
console.log(stories);
await handleUpload(stories);

process.exit();
