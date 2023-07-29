import { google } from 'googleapis';

/**
 * @param {{auth:OAuth2Client,playlistId?:String,ids?:String[],videoId?:String,pageToken?:String}}
 */
export default async ({ auth, playlistId, ids, videoId, pageToken }) => {
    const youtube = google.youtube('v3');
    return youtube.playlistItems.list({
        auth,
        part: 'contentDetails,snippet,id,status',
        ...(playlistId ? { playlistId } : {}),
        ...(ids ? { id: ids } : {}),
        ...(videoId ? { videoId } : {}),
        ...(pageToken ? { pageToken } : { mine: true }),
        maxResults: 50,
    });
};
