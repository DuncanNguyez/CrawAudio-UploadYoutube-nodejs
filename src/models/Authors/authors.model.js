import { Schema, model } from 'mongoose';

const authorsSchema = new Schema(
    {
        id: { type: String, required: true },
        name: String,
        youtubeUrl: String,
        youtubeId: String,
        url: { type: String, require: true },
        crawled: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Authors = model('authors', authorsSchema);

export default Authors;
