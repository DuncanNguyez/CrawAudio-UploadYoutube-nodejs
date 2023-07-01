import { chromium } from 'playwright-chromium';

export default async ({ profileDir = `${process.cwd()}/assets/Profiles` }) => {
    const browser = await chromium.launchPersistentContext(profileDir, {
        headless: false,
        args: ['--disable-blink-features=AutomationControlled'],
    });
    const page = await browser.newPage();

    return { browser, page };
};
