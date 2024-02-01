import config from 'config';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { port, name } = config.get('database');
const {
    MONGODB_HOST: host,
    MONGODB_USERNAME: username,
    MONGODB_PASSWORD: password,
    NODE_ENV: env,
} = process.env;

export default async () => {
    const uri =
        env == 'production'
            ? `mongodb+srv://${username}:${password}@${host}/${name}`
            : `mongodb://localhost:${port}/${name}`;
    const cnn = await mongoose.connect(uri);

    console.log(
        `Successfully connected to MongoDb on ${cnn.connections[0].port}`
    );
    console.log(`DbName: ${name}`);
};
