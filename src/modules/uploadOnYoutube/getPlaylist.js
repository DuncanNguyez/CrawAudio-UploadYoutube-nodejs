import { google } from 'googleapis';

/**
 * @param {{auth:OAuth2Client,playlistIds?:String[],pageToken?:String}}
 */
export default async ({ auth, playlistIds, pageToken }) => {
    const youtube = google.youtube('v3');
    return youtube.playlists.list({
        auth,
        part: 'contentDetails,snippet,id,status',
        maxResults: 50,
        ...(pageToken ? { pageToken } : { mine: true }),
        ...(playlistIds ? { id: playlistIds } : { mine: true }),
    });
};
