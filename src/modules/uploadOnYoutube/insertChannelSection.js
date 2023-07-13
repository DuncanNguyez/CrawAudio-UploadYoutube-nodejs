import { google } from 'googleapis';

export default async ({ auth, playlistIds, author }) => {
    const youtube = google.youtube('v3');
    return youtube.channelSections.insert({
        auth,
        part: 'contentDetails,snippet,id',
        requestBody: {
            snippet: {
                type: 'multiplePlaylists',
                style: 'horizontalRow',
                title: author,
                position: 0,
            },

            contentDetails: { playlists: playlistIds },
        },
    });
};
