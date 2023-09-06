import { Schema, model } from 'mongoose';

const screenSchema = new Schema(
    {
        clientId: String,
        projectId: String,
        clientSecret: String,
        redirectUrl: String,
        published: { type: Boolean, default: false },
        email: String,
        quotaToday: {
            type: String,
            enum: ['available', 'exceeded'],
            default: 'available',
        },
    },
    { timestamps: true }
);

const Screens = model('screens', screenSchema);

export default Screens;
