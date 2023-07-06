import { google } from 'googleapis';

export default async ({ auth, channelSectionId }) => {
    const youtube = google.youtube('v3');
    return youtube.channelSections.list({
        auth,
        part: 'contentDetails,snippet',
        id: channelSectionId,
    });
};
