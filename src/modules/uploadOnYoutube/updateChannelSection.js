import { google } from 'googleapis';

export default async ({ auth, playlistIds, channelSectionId, author }) => {
    const youtube = google.youtube('v3');
    return youtube.channelSections.update({
        auth,
        part: 'contentDetails,snippet,id',
        requestBody: {
            id: channelSectionId,
            snippet: {
                type: 'multiplePlaylists',
                style: 'horizontalRow',
                title: author,
            },

            contentDetails: { playlists: playlistIds },
        },
    });
};
