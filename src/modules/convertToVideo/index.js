import getAudioDurationInSeconds from 'get-audio-duration';
import videoshow from 'videoshow';

export default async (imagesPath, audioPath, videoPath) => {
    const videoOptions = {
        fps: 1,
        loop: await getAudioDurationInSeconds(audioPath), // seconds
        videoBitrate: 250,
        videoCodec: 'mpeg4',
        size: '640x?',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mp4',
        pixelFormat: 'nv21',
    };
    return new Promise((resolve, reject) => {
        videoshow(imagesPath, videoOptions)
            .audio(audioPath)
            .save(videoPath)
            .on('start', function (command) {
                console.log('ffmpeg process started:', command);
            })
            .on('end', resolve)
            .on('error', reject);
    });
};
