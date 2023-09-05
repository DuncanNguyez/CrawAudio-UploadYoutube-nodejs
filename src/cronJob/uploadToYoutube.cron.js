import ora from 'ora';
import lodash from 'lodash';

import { Screens, Stories } from '../models/index.js';
import { handleUpload } from './services/index.js';

const { truncate } = lodash;

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

    // refactor the descriptions to match the api
    const descriptionsRefactored = truncate(
        stories.descriptions.replace(/[&'"><\\]/g, '-'),
        {
            length: 4999,
        }
    );

    const screens = await Screens.find({ published: true }).lean();
    const spinner = ora();
    for (const screen of screens) {
        const projectId = screen.projectId;
        spinner.clear();
        spinner.start(`Uploading by ${projectId}`);
        const status = await handleUpload(
            {
                ...stories,
                descriptions: descriptionsRefactored,
            },
            screen,
            projectId
        );
        if (status) {
            spinner.succeed(`Uploaded by ${projectId}`);
            return;
        }
        spinner.fail(`Uploading by ${projectId} failed`);
    }
};
