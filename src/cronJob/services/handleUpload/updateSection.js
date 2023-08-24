import ora from 'ora';
import lodash from 'lodash';

import {
    getChannelSection,
    insertChannelSection,
    updateChannelSection,
} from '../../../modules/uploadOnYoutube/index.js';

const { includes } = lodash;

export default async ({
    author,
    playlistId,
    auth,
    storyName,
    channelSectionTotal,
}) => {
    const spinner = ora();
    if (!author.youtubeId) {
        if (channelSectionTotal >= 10) {
            return null;
        }
        spinner.start('Create channel section');
        const {
            data: { id: channelSectionId },
        } = await insertChannelSection({
            auth,
            playlistIds: [playlistId],
            author: author.name,
        });
        spinner.succeed(`Created ${author.name} channel section`);

        return channelSectionId;
    } else {
        spinner.start('Update channel section');
        if (includes(author.playlistIds, playlistId)) {
            spinner.succeed(
                `Playlist ${storyName} already in the ${author.name} channel section`
            );
            return author.youtubeId;
        }
        const {
            data: {
                items: [
                    {
                        contentDetails: { playlists: playlistIds },
                    },
                ],
            },
        } = await getChannelSection({
            auth,
            channelSectionId: author.youtubeId,
        });
        await updateChannelSection({
            auth,
            channelSectionId: author.youtubeId,
            playlistIds: [...playlistIds, playlistId],
            author: author.name,
        });
        spinner.succeed(`Updated ${author.name} channel section`);
        return author.youtubeId;
    }
};
