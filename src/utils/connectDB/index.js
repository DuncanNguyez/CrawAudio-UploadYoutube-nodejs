import config from 'config';
import mongoose from 'mongoose';

const { port, name } = config.get('database');

export default async () => {
    const url = `mongodb://localhost:${port}/${name}`;
    await mongoose.connect(url);
    console.log(`Successfully connected to MongoDb on ${port}`);
    console.log(`DbName: ${name}`);
};
