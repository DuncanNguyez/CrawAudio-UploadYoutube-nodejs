import { handleCrawlInfo } from '../src/cronJob/services/index.js';
import { Authors } from '../src/models/index.js';
import { connectDB } from '../src/utils/index.js';

await connectDB();
const authorId = process.argv[2];
const name = process.argv[3];
const url = `https://audiotruyenfull.com/tac-gia/${authorId}/?stt=hoan-thanh`;
const crawlAuthorPage = await handleCrawlInfo(url);
if (crawlAuthorPage) {
    await Authors.create({ id: authorId, crawled: true, url, name });
}

process.exit();
