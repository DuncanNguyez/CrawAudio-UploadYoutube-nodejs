import { Authors } from '../../../models/index.js';

export default async (author) =>
    Authors.updateOne({ id: author.id }, { $set: author }, { upsert: true });
