import { google } from 'googleapis';
import fs from 'fs';

export default async ({ auth, title, description, tags, videoPath }) => {
    const youtube = google.youtube('v3');
    return youtube.videos.insert({
        auth,
        part: 'id,snippet,status',
        requestBody: {
            snippet: {
                title,
                tags,
                description,
                defaultAudioLanguage: 'vi',
                defaultLanguage: 'vi',
            },
            status: { privacyStatus: 'public' },
        },
        media: { body: fs.createReadStream(videoPath) },
    });
};
