import { getPlaylist } from '../../modules/uploadOnYoutube/index.js';

export default async (auth, title) => {
    let pageToken = '';
    let condition = true;
    let list = undefined;
    while (condition) {
        const {
            data: { items, nextPageToken },
        } = await getPlaylist({ auth, pageToken });
        list = find(items, (item) => item.snippet.title === title);
        if (list) {
            condition = false;
        }
        if (!nextPageToken) {
            condition = false;
        }
    }

    return list;
};
