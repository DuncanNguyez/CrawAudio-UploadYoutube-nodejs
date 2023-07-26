import lodash from 'lodash';
import ora from 'ora';

import crawInfoDetails from '../../../modules/crawInfoDetails/index.js';
import { ResultLogs } from '../../../models/index.js';
import getDurations from '../../../utils/getDurations.js';
import updateStory from './updateStory.js';
import updateGenres from './updateGenres.js';
import updateAuthor from './updateAuthor.js';

const { map } = lodash;

/**
 * @param {String} pageUrl is url of page
 * @return {Promise<Boolean>} status processing
 * @descriptions
 * - Crawling info data from page
 * - Updating the data to DB
 */
export default async (pageUrl) => {
    const spinner = ora(`Crawling: ${pageUrl}`).start();
    const startTime = process.hrtime();

    try {
        console.time('Crawling time');
        const infoStoriesOnPage = await crawInfoDetails({ pageUrl });
        spinner.succeed(`Crawled: ${pageUrl}`);
        console.timeEnd('Crawling time');

        console.time('Updating time');
        spinner.start('Updating DB');
        await Promise.all(
            map(infoStoriesOnPage, async (story) =>
                Promise.all([
                    updateStory(story),
                    updateGenres(story.genres),
                    updateAuthor(story.author),
                ])
            )
        );
        spinner.succeed('updated');
        console.timeEnd('Updating time');

        await ResultLogs.create({
            workspace: 'crawInfo',
            info: {
                status: true,
                message: 'Crawled',
                metadata: {
                    page: pageUrl,
                },
            },
            durations: getDurations(startTime),
        });

        return true;
    } catch (error) {
        console.error(error.message);
        await ResultLogs.create({
            workspace: 'crawInfo',
            info: {
                status: true,
                message: error.message,
                metadata: {
                    page: pageUrl,
                },
            },
            durations: getDurations(startTime),
        });
        console.error(error);
        spinner.fail('CrawInfo failed!');
        return false;
    }
};
