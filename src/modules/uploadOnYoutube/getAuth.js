import { oauth2Client } from '../../utils';
import dotenv from 'dotenv';

dotenv.config();

const {
    YOUTUBE_CLIENT_ID: clientId,
    YOUTUBE_CLIENT_SECRET: clientSecret,
    YOUTUBE_REDIRECT_URL: redirectUrl,
} = process.env;
const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl',
];
const credentialsPath = `${process.cwd()}/credentials.json`;

export default async () =>
    oauth2Client({
        clientId,
        clientSecret,
        redirectUrl,
        scopes,
        credentialsPath,
    });
