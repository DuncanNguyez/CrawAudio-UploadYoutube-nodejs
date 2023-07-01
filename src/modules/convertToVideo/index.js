import getAudioDurationInSeconds from 'get-audio-duration';
import videoshow from 'videoshow';

export default async (imagesPath, audioPath, videoPath) => {
    const videoOptions = {
        fps: 25,
        loop: await getAudioDurationInSeconds(audioPath), // seconds
        transition: true,
        transitionDuration: 1, // seconds
        videoBitrate: 1024,
        videoCodec: 'libx264',
        size: '640x?',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mp4',
        pixelFormat: 'yuv420p',
    };
    await videoshow(imagesPath, videoOptions)
        .audio(audioPath)
        .save(videoPath)
        .on('start', function (command) {
            console.log('ffmpeg process started:', command);
        })
        .on('error', function (err, stdout, stderr) {
            console.error('Error:', err);
            console.error('ffmpeg stderr:', stderr);
        })
        .on('end', function (output) {
            console.error('Video created in:', output);
        });
};
