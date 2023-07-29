import ora from 'ora';

import { Authors } from '../models/index.js';
import { handleCrawlInfo } from './services/index.js';

/**
 *  crawl info of page by author
 */
export default async () => {
    const author = await Authors.findOne({ crawled: false }).lean();
    if (!author) {
        ora().succeed('All authorPage crawled');
        return;
    }
    const url = `${author.url}/stt-hoan-thanh`;
    const crawlAuthorPage = await handleCrawlInfo(url);
    if (crawlAuthorPage) {
        await Authors.updateOne({ id: author.id }, { $set: { crawled: true } });
    }
};
