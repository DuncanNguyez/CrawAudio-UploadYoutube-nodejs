import { Schema, model } from 'mongoose';

const item = new Schema({
    audioUrl: { type: String, required: true },
    episode: { type: Number, required: true },
    status: Boolean,
    youtubeUrl: String,
    youtubeId: String,
});

const storiesSchema = new Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        authorId: { type: String, required: true },
        genres: [String],
        url: String,
        imageUrl: String,
        youtubeUrl: String,
        youtubeId: String,
        listItems: [item],
        totalEpisode: Number,
        descriptions: String,
        overviewUploaded: Boolean,
        status: {
            type: String,
            enum: ['pending', 'uploading', 'uploaded'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const Stories = model('stories', storiesSchema);

export default Stories;
