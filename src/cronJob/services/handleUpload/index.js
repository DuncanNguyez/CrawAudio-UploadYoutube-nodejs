import lodash from 'lodash';
import ora from 'ora';

import { Stories, Authors, ResultLogs } from '../../../models/index.js';
import prepareVideo from './prepareVideo.js';
import uploadVideo from './uploadVideo.js';
import updatePlaylist from './updatePlaylist.js';
import updateSection from './updateSection.js';
import getDurations from '../../../utils/getDurations.js';
import clearFolder from '../../../utils/clearFolder.js';
import { getAuth } from '../../../modules/uploadOnYoutube/index.js';

const { sortBy, find } = lodash;

/**
 * @param {stories} stories
 * @param {Screens} screen
 * @param {Screens.projectId} projectId
 * @return {Promise<Boolean>} status handle uploading
 * @description
 * - uploading video into youtube
 * - push the video into playlist
 * - push the playlist into channel section
 */
export default async (stories, screen, projectId) => {
    const startTime = process.hrtime();
    const {
        id,
        name,
        authorId,
        genres,
        imageUrl,
        youtubeId,
        listItems,
        descriptions,
    } = stories;
    console.log('\x1b[33m%s\x1b[0m', `\nProcessing ${name}\n`);
    const spinner = ora();

    const author = await Authors.findOne({ id: authorId }).lean();
    const listItemsSorted = sortBy(listItems, 'episode');
    const item = find(listItemsSorted, (i) => i.status === 'pending');

    if (!item) {
        spinner.succeed(`${name} play list uploaded`);
        await Stories.updateOne(
            { id },
            {
                $set: {
                    status: 'uploaded',
                },
            }
        );

        return true;
    }

    await Stories.updateOne(
        { id, 'listItems.episode': item.episode },
        { $set: { 'listItems.$.status': 'uploading' } }
    );

    const itemName = `${id}_episode_${item.episode}`;
    const imagePath = `${process.cwd()}/files/images/${id}.png`;
    const audioPath = `${process.cwd()}/files/audios/${itemName}.mp3`;
    const videoPath = `${process.cwd()}/files/videos/${itemName}.mp4`;

    try {
        console.time('prepareVideo');
        const auth = await getAuth(screen);

        await prepareVideo({
            audioPath,
            imagePath,
            item,
            itemName,
            imageUrl,
            videoPath,
        });
        console.timeEnd('prepareVideo');

        const tags = [id, authorId, ...genres];
        const title = `#${item.episode} ${name} | ${author.name}`;
        const videoId = await uploadVideo({
            tags,
            descriptions,
            auth,
            title,
            videoPath,
        });

        const playlistTitle = `${name} | ${author.name}`;
        const playlistId = await updatePlaylist({
            youtubeId,
            auth,
            tags,
            descriptions,
            videoId,
            title: playlistTitle,
            position: item.episode - 1,
        });

        const channelSectionTotal = await Authors.find({
            youtubeId: { $ne: null },
        }).count();

        const channelSectionId = await updateSection({
            author,
            playlistId,
            auth,
            storyName: name,
            channelSectionTotal,
        });

        if (channelSectionId) {
            await Authors.updateOne(
                { id: author.id },
                {
                    $set: { youtubeId: channelSectionId },
                    $addToSet: { playlistIds: playlistId },
                }
            );
        }

        await Stories.updateOne(
            { id, 'listItems.episode': item.episode },
            {
                $set: {
                    'listItems.$.status': 'uploaded',
                    'listItems.$.youtubeId': videoId,
                    'listItems.$.youtubeUrl': `https://youtu.be/${videoId}`,
                    status: 'uploading',
                    youtubeId: playlistId,
                    youtubeUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
                },
            }
        );
        await ResultLogs.create({
            info: {
                status: true,
                message: 'uploaded',
                metadata: {
                    story: name,
                    episode: item.episode,
                    author: author.name,
                    projectId,
                },
            },
            workspace: 'handleUpload',
            durations: getDurations(startTime),
        });
        await Promise.all([
            clearFolder(audioPath),
            clearFolder(videoPath),
            // clearFolder(imagePath),
        ]);
        return true;
    } catch (error) {
        await Stories.updateOne(
            { id, 'listItems.episode': item.episode },
            { $set: { 'listItems.$.status': 'pending' } }
        );

        console.error(error.message);
        await ResultLogs.create({
            info: {
                status: false,
                message: error.message,
                metadata: {
                    story: name,
                    episode: item.episode,
                    author: author.name,
                    projectId,
                },
            },
            workspace: 'handleUpload',
            durations: getDurations(startTime),
        });
        spinner.fail('Handle uploading failed!');

        return false;
    }
};
