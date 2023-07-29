import { getPlaylistItems } from '../../modules/uploadOnYoutube/index.js';

export default async (auth, playlistId) => {
    let pageToken = '';
    let condition = true;
    const allPlaylistItems = [];

    while (condition) {
        const {
            data: { nextPageToken, items: playlistItems },
        } = await getPlaylistItems({ auth, playlistId, pageToken });
        pageToken = nextPageToken;
        allPlaylistItems.push(...playlistItems);
        if (!nextPageToken) {
            condition = false;
        }
    }
    return allPlaylistItems;
};
