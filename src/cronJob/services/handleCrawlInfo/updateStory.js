import lodash from 'lodash';

import { Stories } from '../../../models/index.js';

const { map } = lodash;

export default async ({
    items,
    author,
    descriptions,
    genres,
    id,
    thumbnail,
    title,
    totalEpisode,
    url,
}) =>
    !(await Stories.findOne({ id }).lean()) &&
    Stories.updateOne(
        { id },
        {
            $set: {
                authorId: author.id,
                listItems: items,
                id,
                name: title,
                imageUrl: thumbnail,
                totalEpisode,
                url,
                genres: map(genres, 'id'),
                descriptions,
            },
        },
        { upsert: true }
    );
