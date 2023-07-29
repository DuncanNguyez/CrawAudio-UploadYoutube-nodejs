import lodash from 'lodash';
import { JSDOM } from 'jsdom';
import { Authors, Stories } from '../src/models/index.js';
import { connectDB } from '../src/utils/index.js';

const { map, includes, compact, flatMap } = lodash;

const getUnfinished = async (pageUrl) => {
    const dom = await JSDOM.fromURL(pageUrl);
    const statusElements = dom.window.document.querySelectorAll('.infoloop');
    const unfinished = compact(
        map(statusElements, (element) => {
            const checkStatus = includes(element.innerHTML, 'Hoàn thành');
            return !checkStatus
                ? element.parentElement.querySelector('.entry-title a')
                : null;
        })
    );
    return unfinished;
};
await connectDB();
const authors = await Authors.find().lean();

const stories = await Promise.all(
    map(authors, async (author) => {
        const unfinished = await getUnfinished(author.url);
        return map(unfinished, (item) => {
            const regex = /\/([^/]+)\/{0,1}$/;
            const singleStoryUrl = item.attributes.href.textContent;
            return regex.exec(singleStoryUrl)?.[1];
        });
    })
);

const storiesIds = flatMap(stories);

console.log(storiesIds);
console.log(storiesIds.length);

await Stories.deleteMany({ id: { $in: storiesIds } });

process.exit();
