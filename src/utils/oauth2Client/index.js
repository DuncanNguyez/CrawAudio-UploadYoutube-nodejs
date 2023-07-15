import { google } from 'googleapis';
import fs from 'fs';
import dotenv from 'dotenv';

import setupBrowser from '../setupBrowser/index.js';

dotenv.config();
const { EMAIL: email, PASSWORD: password } = process.env;

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

    if (fs.existsSync(credentialsPath)) {
        const credentialsData = fs.readFileSync(credentialsPath);
        const credentials = JSON.parse(credentialsData);
        // console.log({ credentials });
        oauth2Client.setCredentials(credentials);

        // Access token has expired, refresh it
        if (credentials.expiry_date < Date.now()) {
            await oauth2Client.refreshAccessToken();
            const newCredentials = oauth2Client.credentials;
            fs.writeFileSync(credentialsPath, JSON.stringify(newCredentials));
        }
    } else {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
        // console.log({ authUrl });
        const code = await getCodeFromBrowser({ url: authUrl, redirectUrl });
        console.log({ code });
        const { tokens: credentials } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(credentials);
        // console.log({ credentials });
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
    }
    return oauth2Client;
};

const getCodeFromBrowser = async ({ url, redirectUrl }) => {
    const profileDir = `${process.cwd()}/assets/Profiles`;
    const { browser, page } = await setupBrowser({ profileDir });

    // try url include code response from gg
    const lastUrlPromise = new Promise((resolve, reject) => {
        page.on('request', (req) => {
            if (req.url().match(new RegExp(redirectUrl, 'i'))) {
                resolve(req.url());
                console.log(req.url());
            }
        });
        setTimeout(() => {
            reject(new Error(`Not try url matched, time out: 20s`));
        }, 180000);
    });

    // login gg account
    try {
        await page.goto(url, { waitUntil: 'load' });

        const identifier = await page.$(`div[data-identifier="${email}"]`);

        if (identifier) {
            await identifier.click();
        } else {
            await page.fill('#identifierId', email);
            const next = await page.$$('button');
            await next.at(3).click();
            await page.fill('input[type="password"]', password);
            const login = await page.$$('button');
            await login.at(2).click();
            const next2 = await page.$$('button');
            await next2.at(0).click();
        }

        await page.waitForURL(/.*warning.*/);
        const buttons = await page.$$('button[jscontroller][jsname]');
        const tieptuc = buttons.at(2);
        await tieptuc.click();

        await page.waitForURL(/.*consentsummary.*/);
        const input = await page.$('input');
        await input.click();
        await (await page.$$('button')).at(2).click();
    } catch (error) {
        console.error('getCodeFromBrowser Error');
    }

    const code = (await lastUrlPromise)
        .match('code=.*&')?.[0]
        .replace('%2F', '/')
        .replace('code=', '')
        .replace('&', '');
    console.log('code', code);
    await page.close();
    await browser.close();
    return code;
};
