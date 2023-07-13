import ora from 'ora';

import { insertVideo } from '../../../modules/uploadOnYoutube/index.js';

export default async ({ tags, descriptions, auth, title, videoPath }) => {
    const spinner = ora();
    spinner.start('Video uploading');
    const {
        data: { id: videoId },
    } = await insertVideo({
        auth,
        description: descriptions,
        tags,
        title,
        videoPath: videoPath,
    });
    spinner.succeed('Video uploaded');
    return videoId;
};
