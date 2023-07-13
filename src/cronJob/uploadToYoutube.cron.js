import { Stories } from '../models/index.js';
import { handleUpload } from './services/index.js';

export default async () => {
    const stories =
        (await Stories.findOne({ status: 'uploading' }).lean()) ||
        (await Stories.findOne({ status: 'pending' }).lean());
    await handleUpload(stories);
};
