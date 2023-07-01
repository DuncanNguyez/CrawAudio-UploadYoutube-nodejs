import { Schema, model } from 'mongoose';

const item = new Schema({
    audioUrl: { type: String, required: true },
    episode: { type: Number, required: true },
    status: Boolean,
    youtubeUrl: String,
});

const storiesSchema = new Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        authorId: { type: String, required: true },
        genres: [String],
        imageUrl: String,
        youtubeUrl: String,
        listItem: [item],
    },
    { timestamps: true }
);

const Stories = model('stories', storiesSchema);

export default Stories;
