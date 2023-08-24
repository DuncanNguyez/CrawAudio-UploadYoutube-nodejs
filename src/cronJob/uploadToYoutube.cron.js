import ora from 'ora';

import { Screens, Stories } from '../models/index.js';
import { handleUpload } from './services/index.js';

export default async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stories =
        (await Stories.findOne({
            status: 'uploading',
            updatedAt: { $lt: today },
        }).lean()) ||
        (await Stories.findOne({
            status: 'pending',
            updatedAt: { $lt: today },
        }).lean());
    const screens = await Screens.find({ published: true }).lean();
    const spinner = ora();
    for (const screen of screens) {
        const projectId = screen.projectId;
        spinner.clear();
        spinner.start(`Uploading by ${projectId}`);
        const status = await handleUpload(stories, screen, projectId);
        if (status) {
            spinner.succeed(`Uploaded by ${projectId}`);
            return;
        }
        spinner.fail(`Uploading by ${projectId} failed`);
    }
};
