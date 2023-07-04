import axios from 'axios';
import fs from 'fs';

export default async ({ filePath, url }) => {
    try {
        const res = await axios({
            url,
            method: 'get',
            responseType: 'stream',
        });
        const file = fs.createWriteStream(filePath);
        res.data.pipe(file);
        await new Promise((resolve, reject) => {
            file.on('finish', resolve);
            file.on('error', reject);
        });
        console.log('Saved file');
        console.log(filePath);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};
