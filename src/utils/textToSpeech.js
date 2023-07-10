import gTTS from 'gtts';

export default async ({ text, filePath }) => {
    return new Promise((resolve, reject) => {
        const gtts = new gTTS(text, 'vi');
        gtts.save(filePath, (err) => {
            if (err) {
                reject(err);
            }
            resolve(filePath);
        });
    });
};
