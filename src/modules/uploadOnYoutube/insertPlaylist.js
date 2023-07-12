import { google } from 'googleapis';

export default async ({ auth, title, description, tags }) => {
    const youtube = google.youtube('v3');
    return youtube.playlists.insert({
        auth,
        part: 'id,snippet,status',
        requestBody: {
            snippet: {
                title,
                description,
                tags,
            },
            status: { privacyStatus: 'public' },
        },
    });
};
