import ora from 'ora';

import {
    getChannelSection,
    insertChannelSection,
    updateChannelSection,
} from '../../../modules/uploadOnYoutube/index.js';

export default async ({ author, playlistId, auth }) => {
    const spinner = ora();
    if (!author.youtubeId) {
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
        const {
            data: {
                items: [
                    {
                        contentDetails: { playlistIds },
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
        });
        spinner.succeed(`Updated ${author.name} channel section`);
        return author.youtubeId;
    }
};
