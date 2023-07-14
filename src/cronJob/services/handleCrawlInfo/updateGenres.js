import lodash from 'lodash';

import { Genres } from '../../../models/index.js';

const { map } = lodash;

export default async (genres) =>
    Promise.all(
        map(
            genres,
            async (genre) =>
                !(await Genres.findOne({ id: genre.id })) &&
                Genres.updateOne(
                    { id: genre.id },
                    {
                        $set: genre,
                    },
                    { upsert: true }
                )
        )
    );
