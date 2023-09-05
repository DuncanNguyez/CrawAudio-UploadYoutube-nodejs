import lodash from 'lodash';
import { JSDOM } from 'jsdom';

const { map, includes, compact, truncate } = lodash;

export default async ({ pageUrl }) => {
    const storiesCompleted = await getStoriesCompleted(pageUrl);
    return Promise.all(map(storiesCompleted, crawlStory));
};

const getStoriesCompleted = async (pageUrl) => {
    const dom = await JSDOM.fromURL(pageUrl);
    const statusElements = dom.window.document.querySelectorAll('.infoloop');
    const storiesCompleted = compact(
        map(statusElements, (element) => {
            const checkStatus = includes(element.innerHTML, 'Hoàn thành');
            return checkStatus
                ? element.parentElement.querySelector('.entry-title a')
                : null;
        })
    );
    return storiesCompleted;
};

const crawlStory = async (item) => {
    const regex = /\/([^/]+)\/{0,1}$/;
    const singleStoryUrl = item.attributes.href.textContent;
    const infoDetailUrl = item.attributes.href.textContent;
    const storyId = regex.exec(infoDetailUrl)?.[1];
    const domInfo = await JSDOM.fromURL(infoDetailUrl);
    const document = domInfo.window.document;
    const title = document.querySelector('.entry-title')?.textContent;

    const infoElement = document.querySelector('.infotruyen');

    const thumbnail = infoElement.querySelector('img').getAttribute('data-src');

    const descriptionsStory =
        document
            .querySelector('.infotruyen > p')
            ?.textContent.replace('Xem thêm', '') +
            document.querySelector('.infotruyen > div.read_div')?.textContent ||
        '';
    const infoList = document.querySelector('.infotruyen > span').innerHTML;

    // get author info
    const stringTagAuthor = infoList
        .match('Tác giả:.*Thể loại:')?.[0]
        .match('<a.*a>')?.[0];
    const template = document.createElement('template');
    template.innerHTML = stringTagAuthor;
    const tagAuthor = template.content.children[0];
    const authorUrl = tagAuthor.href;
    const matchedAuthorId = regex.exec(authorUrl);
    const author = {
        name: tagAuthor.textContent,
        url: authorUrl,
        id: matchedAuthorId?.[1],
    };

    // get genres info
    const stringTagsGenres = infoList
        .match('Thể loại:.*Loại:')?.[0]
        .match(/<a.*a>/);
    const divTag = document.createElement('div');
    divTag.innerHTML = stringTagsGenres;
    const tagsGenres = divTag.querySelectorAll('a');
    const genres = map(tagsGenres, (item) => {
        const genresName = item.textContent;
        const url = item.href;
        const matchedGenreId = regex.exec(url.replace(/\/$/, ''));
        return { name: genresName, url, id: matchedGenreId?.[1] };
    });

    // get Episode info
    const audioContentElement = document.querySelectorAll(
        '.tad-field-content-audio'
    );
    const list1 = audioContentElement[1]?.querySelectorAll(
        '.tad-field-content-items'
    );
    const list0 = audioContentElement[0]?.querySelectorAll(
        '.tad-field-content-items'
    );
    const items =
        list1 && list1.length > 0
            ? list1
            : list0 && list0.length > 0
            ? list0
            : null;
    const episodesInfo = map(items, (item) => {
        const episode = item.id;
        const audioUrl = item.querySelector('b').id;
        return { episode, audioUrl };
    });

    const totalEpisode = items.length;

    // refactor the descriptions to match the api
    const descriptionsRefactored = truncate(
        descriptionsStory.replace(/[&'"><\\]/g, '-'),
        {
            length: 4999,
        }
    );

    const result = {
        id: storyId,
        url: singleStoryUrl,
        title,
        thumbnail,
        descriptions: descriptionsRefactored,
        author,
        totalEpisode,
        genres,
        items: episodesInfo,
    };
    // console.log(result);
    // process.exit();
    return result;
};
