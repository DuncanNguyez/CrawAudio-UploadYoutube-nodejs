import readline from 'readline';
import { CronJob } from 'cron';

import { handleUpload } from '../src/cronJob/services/index.js';
import { Screens, Stories } from '../src/models/index.js';
import { connectDB } from '../src/utils/index.js';
import ora from 'ora';
import { getAuth } from '../src/modules/uploadOnYoutube/index.js';

await connectDB();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const id = await new Promise((resolve) => rl.question('storyId: ', resolve));

const check = await Stories.findOne({ id }).lean();
if (check) {
    const job = async () => {
        const stories = await Stories.findOne({ id }).lean();
        const screens = await Screens.find({ published: true }).lean();
        const spinner = ora();
        for (const screen of screens) {
            const projectId = screen.projectId;
            spinner.start(`Uploading by ${projectId}`);
            const auth = await getAuth(screen);
            const status = await handleUpload(stories, auth, projectId);
            if (status) {
                spinner.succeed(`Uploaded by ${projectId}`);
                return;
            }
            spinner.fail(`Uploading by ${projectId} failed`);
        }
    };
    const uploadJob = new CronJob(
        '0 50 * * * *',
        job,
        null,
        false,
        null,
        null,
        true
    );
    uploadJob.start();
} else {
    console.log(`${id} story not found!`);
}
