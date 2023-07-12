import { google } from 'googleapis';

export default async ({ auth, playlistIds, channelSectionId }) => {
    const youtube = google.youtube('v3');
    return youtube.channelSections.update({
        auth,
        part: 'contentDetails,snippet,id',
        requestBody: {
            id: channelSectionId,
            snippet: {
                type: 'multiplePlaylists',
                style: 'horizontalRow',
            },

            contentDetails: { playlists: playlistIds },
        },
    });
};
