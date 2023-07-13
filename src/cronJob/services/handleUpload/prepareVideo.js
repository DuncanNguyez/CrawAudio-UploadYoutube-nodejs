import ora from 'ora';
import fs from 'fs';
import { getFileFromUrl } from '../../../utils/index.js';
import convertToVideo from '../../../modules/convertToVideo/index.js';

export default async ({
    videoPath,
    imagePath,
    audioPath,
    imageUrl,
    item,
    itemName,
}) => {
    const spinner = ora();
    spinner.start(`Downloading image: ${itemName}`);
    const imageExisted = fs.existsSync(imagePath);
    const saveImage = imageExisted
        ? imageExisted
        : await getFileFromUrl({
              filePath: imagePath,
              url: imageUrl,
          });
    if (!saveImage) {
        spinner.fail('Save image failed!');
        throw Error('Save image failed!');
    }
    spinner.succeed(`Downloaded image: ${itemName}`);

    spinner.start(`Downloading audio: ${itemName}`);
    const audioExisted = fs.existsSync(audioPath);

    const saveAudio = audioExisted
        ? audioExisted
        : await getFileFromUrl({
              filePath: audioPath,
              url: item.audioUrl,
          });
    if (!saveAudio) {
        spinner.fail('Save audio failed!');
        throw Error('Save audio failed!');
    }
    spinner.succeed(`Downloaded audio: ${itemName}`);

    spinner.start(`Converting to video`);
    const videoExisted = fs.existsSync(videoPath);
    !videoExisted &&
        (await convertToVideo({
            imagesPath: imagePath,
            audioPath,
            videoPath,
        }));
    spinner.succeed(`Video ${itemName}.mp4 converted`);
};
