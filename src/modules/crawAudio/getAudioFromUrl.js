import axios from 'axios';
import fs from 'fs';

export default async ({ filePath, audioUrl }) => {
    try {
        const res = await axios({
            url: audioUrl,
            method: 'get',
            responseType: 'stream',
        });

        const audioFile = fs.createWriteStream(filePath);
        res.data.pipe(audioFile);
        console.log('Saved audio file');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};
