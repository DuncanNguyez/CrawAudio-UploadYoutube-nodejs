import { google } from 'googleapis';
import fs from 'fs';

import setupBrowser from '../setupBrowser';

/**
 *
 */
export default async ({
    clientId,
    clientSecret,
    redirectUrl,
    scopes,
    credentialsPath,
}) => {
    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUrl
    );
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    console.log({ authUrl });
    try {
        const credentialsData = fs.readFileSync(credentialsPath);

        const credentials = JSON.parse(credentialsData);
        oauth2Client.credentials = credentials;
    } catch (error) {
        const code = await getCodeFromBrowser(authUrl);
        console.log({ code });
        const { tokens: credentials } = await oauth2Client.getToken(code);
        oauth2Client.credentials = credentials;
        console.log({ credentials });
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
    }
    return oauth2Client;
};

const getCodeFromBrowser = async (url) => {
    const profileDir = `${process.cwd()}/assets/Profiles`;
    const { browser, page } = await setupBrowser({ profileDir });
    let redirectUrl = '';
    page.on('request', (req) => {
        const locationUrl = req.url();

        // try youtube redirect url
        redirectUrl = locationUrl.match('.*localhost.*') ? locationUrl : '';
    });
    try {
        await page.goto(url, { waitUntil: 'load' });
    } catch (error) {
        console.log();
    }
    const code = redirectUrl
        .match('code=.*&')?.[0]
        .replace('%2F', '/')
        .replace('code=', '')
        .replace('&', '');
    console.log({ code });
    await page.close();
    await browser.close();
    return code;
};
