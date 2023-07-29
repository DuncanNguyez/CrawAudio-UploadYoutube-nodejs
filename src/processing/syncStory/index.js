import lodash from 'lodash';
import ora from 'ora';

import { Authors, ResultLogs, Screens, Stories } from '../../models/index.js';
import { getAuth } from '../../modules/uploadOnYoutube/index.js';
import { getDurations } from '../../utils/index.js';
import findPlaylist from './findPlaylist.js';
import getAllPlaylistItems from './getAllPlaylistItems.js';

const { map } = lodash;

export default async (story) => {
    const { id, name, authorId, listItems } = story;
    const spinner = ora();
    spinner.start('Syncing');
    console.time(`Time sync ${name}: `);
    const startTime = process.hrtime();
    const author = await Authors.findOne({ id: authorId }).lean();
    const screen = await Screens.findOne().lean();
    try {
        const auth = await getAuth(screen);
        const playlistTitle = `${name} | ${author.name}`;
        const list = await findPlaylist(auth, playlistTitle);

        if (!list) {
            throw Error('playlist not found');
        }
        const playlistItems = await getAllPlaylistItems(auth, list.id);

        const listItemsUpdated = map(playlistItems, (item) => {
            const youtubeId = item.contentDetails.videoId;
            const youtubeUrl = `https://youtu.be/${youtubeId}`;
            return {
                youtubeId,
                youtubeUrl,
                status: 'uploaded',
            };
        });
        const newListItems = map(listItems, (item, index) =>
            listItemsUpdated[index]
                ? { ...item, ...listItemsUpdated[index] }
                : item
        );
        console.log({ newListItems });
        await Stories.updateOne(
            { id },
            {
                $set: {
                    youtubeId: list.id,
                    youtubeUrl: `https://www.youtube.com/playlist?list=${list.id}`,
                    listItems: newListItems,
                },
            }
        );
        await ResultLogs.create({
            workspace: 'syncDb',
            durations: getDurations(startTime),
            info: {
                status: true,
                message: 'synced',
                metadata: {
                    story: name,
                    author: author.name,
                    items: listItemsUpdated.length,
                    projectId: screen.projectId,
                },
            },
        });
        spinner.succeed('Synced');
    } catch (error) {
        console.error(error.message);

        await ResultLogs.create({
            workspace: 'syncDb',
            durations: getDurations(startTime),
            info: {
                status: true,
                message: 'synced',
                metadata: {
                    story: name,
                    author: author.name,
                    projectId: screen.projectId,
                },
            },
        });
        spinner.fail('Sync failed');
    }

    console.timeEnd(`Time sync ${name}: `);
};
