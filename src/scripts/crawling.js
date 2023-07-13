import { crawInfoDefaultCron, crawInfoPageCron } from '../cronJob/index.js';

await crawInfoDefaultCron();
await crawInfoPageCron();

process.exit();
