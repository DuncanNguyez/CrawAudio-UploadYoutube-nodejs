import { oauth2Client } from '../../utils/index.js';
import dotenv from 'dotenv';

dotenv.config();

const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl',
];

/**
 * @param {Screens} screenApp
 */
export default async (screenApp) =>
    oauth2Client({
        screenApp,
        scopes,
    });
