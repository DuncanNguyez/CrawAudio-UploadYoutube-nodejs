import { crawInfoDefaultCron, crawInfoPageCron } from '../src/cronJob/index.js';

await crawInfoDefaultCron();
await crawInfoPageCron();

process.exit();
