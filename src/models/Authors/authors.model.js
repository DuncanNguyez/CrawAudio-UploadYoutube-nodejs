import { Schema, model } from 'mongoose';

const authorsSchema = new Schema(
    {
        id: { type: String, required: true },
        name: String,
        youtubeUrl: String,
    },
    { timestamps: true }
);

const Authors = model('authors', authorsSchema);

export default Authors;
