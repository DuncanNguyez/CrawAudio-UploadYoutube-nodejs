import { google } from 'googleapis';

export default async ({ auth, playlistId, videoId }) => {
    const youtube = google.youtube('v3');
    return youtube.playlistItems.insert({
        auth,
        part: 'id,status,snippet',
        requestBody: {
            snippet: {
                playlistId,
                resourceId: {
                    videoId,
                    kind: 'youtube#video',
                },
            },
        },
    });
};
