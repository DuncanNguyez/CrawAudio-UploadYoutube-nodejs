import ffmpeg from 'fluent-ffmpeg';
import { getAudioDurationInSeconds } from 'get-audio-duration';

export default async ({ imagesPath, audioPath, videoPath }) => {
    const command = ffmpeg();
    const loop = await getAudioDurationInSeconds(audioPath);
    return new Promise((resolve, reject) => {
        command

            .input(imagesPath)
            .inputFPS(1)
            .loop(loop / 1.2)
            .input(audioPath)
            .complexFilter(['atempo=1.2', 'scale=w=640:h=trunc(ow/a/2)*2'])
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions(['-b:v 1024k', '-b:a 128k', '-ac 2', '-r 1'])

            .output(videoPath)
            .on('error', reject)
            .on('end', resolve)
            // .on('start', (cmd) => console.log(cmd))
            .run();
    });
};
