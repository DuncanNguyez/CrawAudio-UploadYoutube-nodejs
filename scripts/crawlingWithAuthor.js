import readline from 'readline';

import { handleCrawlInfo } from '../src/cronJob/services/index.js';
import { Authors } from '../src/models/index.js';
import { connectDB } from '../src/utils/index.js';

await connectDB();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const authorId = await new Promise((resolve) =>
    rl.question('authorId: ', resolve)
);
const name = await new Promise((resolve) => rl.question('authorName', resolve));

const url = `https://audiotruyenfull.com/tac-gia/${authorId}/?stt=hoan-thanh`;
const crawlAuthorPage = await handleCrawlInfo(url);
if (crawlAuthorPage) {
    await Authors.create({ id: authorId, crawled: true, url, name });
}

process.exit();
