const ffmpeg = require('fluent-ffmpeg');

export default async ({ imagesPath, audioPath, videoPath }) => {
    const command = ffmpeg();

    return new Promise((resolve, reject) => {
        command
            .input(imagesPath)
            .input(audioPath)
            .audioFilters('atempo=1.2')

            // output configuration options
            .outputOptions('-b:a 128k')
            .outputOptions('-b:v 250')
            .outputOptions('-r 1')
            .outputOptions('-pix_fmt nv21')
            .outputOptions('-c:v mpeg4')
            .outputOptions('-crf 30')

            .output(videoPath)
            .on('error', reject)
            .on('end', resolve)
            .run();
    });
};
