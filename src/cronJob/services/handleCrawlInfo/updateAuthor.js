import { Authors } from '../../../models/index.js';

export default async (author) =>
    !(await Authors.findOne({ id: author.id }).lean()) &&
    Authors.updateOne({ id: author.id }, { $set: author }, { upsert: true });
