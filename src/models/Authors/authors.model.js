import { Schema, model } from 'mongoose';

const authorsSchema = new Schema(
    {
        id: { type: String, required: true },
        name: String,
        youtubeUrl: { type: String, default: null },
        youtubeId: { type: String, default: null },
        playlistIds: [String],
        url: { type: String, require: true },
        crawled: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Authors = model('authors', authorsSchema);

export default Authors;
