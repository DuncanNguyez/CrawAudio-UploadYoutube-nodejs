import { crawInfoDefaultCron, crawInfoPageCron } from '../src/cronJob/index.js';
import { connectDB } from '../src/utils/index.js';

await connectDB();
await crawInfoDefaultCron();
await crawInfoPageCron();

process.exit();
