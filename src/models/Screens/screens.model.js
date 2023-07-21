import { Schema, model } from 'mongoose';

const screenSchema = new Schema(
    {
        clientId: String,
        projectId: String,
        clientSecret: String,
        redirectUrl: String,
    },
    { timestamps: true }
);

const Screens = model('screens', screenSchema);

export default Screens;
