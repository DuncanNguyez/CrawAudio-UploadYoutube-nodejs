import { Screens } from '../models/index.js';

export default async () =>
    Screens.updateMany(
        { published: true },
        { $set: { quotaToday: 'available' } }
    );
