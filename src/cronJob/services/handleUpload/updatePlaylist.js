import ora from 'ora';

import {
    insertPlaylist,
    insertPlaylistItem,
} from '../../../modules/uploadOnYoutube/index.js';

export default async ({
    youtubeId,
    auth,
    tags,
    descriptions,
    videoId,
    title,
    position,
}) => {
    const spinner = ora();
    spinner.start('Updating playlist');
    const playlistId =
        youtubeId ||
        (
            await insertPlaylist({
                auth,
                description: descriptions,
                tags,
                title,
            })
        ).data.id;
    await insertPlaylistItem({
        auth,
        playlistId,
        videoId,
        position,
    });
    spinner.succeed(`Updated ${title} playlist`);
    return playlistId;
};
