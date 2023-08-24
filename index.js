import { CronJob } from 'cron';

import {
    crawInfoDefaultCron,
    crawInfoPageCron,
    uploadToYoutubeCron,
} from './src/cronJob/index.js';
import { connectDB } from './src/utils/index.js';

await connectDB();

const crawInfoDefaultJob = new CronJob(
    '0 0 * * * *',
    crawInfoDefaultCron,
    null,
    false,
    null,
    null,
    true
);
crawInfoDefaultJob.start();

const crawInfoPageJob = new CronJob(
    '0 0 */3 * * *',
    crawInfoPageCron,
    null,
    false,
    null,
    null,
    true
);
crawInfoPageJob.start();

const uploadToYoutubeJob = new CronJob(
    '0 18 * * * *',
    uploadToYoutubeCron,
    null,
    false,
    null,
    null,
    true
);
uploadToYoutubeJob.start();
