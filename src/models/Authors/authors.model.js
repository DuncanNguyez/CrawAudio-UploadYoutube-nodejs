import { Schema, model } from 'mongoose';

const authorsSchema = new Schema(
    {
        id: { type: String, required: true },
        name: String,
        youtubeUrl: String,
        youtubeId: String,
        url: { type: String, require: true },
    },
    { timestamps: true }
);

const Authors = model('authors', authorsSchema);

export default Authors;
