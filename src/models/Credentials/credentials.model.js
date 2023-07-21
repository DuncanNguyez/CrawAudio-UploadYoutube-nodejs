import { Schema, model } from 'mongoose';

const credentialsSchema = new Schema(
    {
        projectId: String,
        accessToken: String,
        scope: String,
        tokenType: String,
        expiryDate: Number,
        refreshToken: String,
    },
    { timestamps: true }
);

const Credentials = model('credentials', credentialsSchema);

export default Credentials;
