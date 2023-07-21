import ora from 'ora';
import { Screens, Stories } from '../models/index.js';
import { getAuth } from '../modules/uploadOnYoutube/index.js';
import { handleUpload } from './services/index.js';

export default async () => {
    const stories =
        (await Stories.findOne({ status: 'uploading' }).lean()) ||
        (await Stories.findOne({ status: 'pending' }).lean());
    const screens = await Screens.find().lean();
    const spinner = ora();
    for (const screen of screens) {
        const projectId = screen.projectId;
        spinner.clear();
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
