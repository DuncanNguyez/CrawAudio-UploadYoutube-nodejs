import { model, Schema } from 'mongoose';

const genresSchema = new Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
    },
    { timestamps: true }
);

const Genres = model('genres', genresSchema);

export default Genres;
