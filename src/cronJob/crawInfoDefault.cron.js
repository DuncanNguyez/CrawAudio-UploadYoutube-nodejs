import fs from 'fs';
import lodash from 'lodash';
import ora from 'ora';

import { handleCrawlInfo } from './services/index.js';

const { reject, find } = lodash;

/**
 *  crawl the page according to the information from the file
 */
export default async () => {
    const pathFile = `${process.cwd()}/pagesDefault.json`;
    const fileData = fs.readFileSync(pathFile);
    const { pages } = JSON.parse(fileData);
    const page = find(pages, (item) => !item.status);
    if (!page) {
        ora().succeed('All pagesUrl crawled');
        return;
    }
    const { url } = page;

    const crawl = await handleCrawlInfo(url);
    if (crawl) {
        const pagesUrlUpdate = {
            pages: [...reject(pages, { url }), { ...page, status: true }],
        };
        fs.writeFileSync(
            `${process.cwd()}/pagesDefault.json`,
            JSON.stringify(pagesUrlUpdate)
        );
    }
};
