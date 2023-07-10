export default (startTime) => {
    const endTime = process.hrtime(startTime);
    const elapsedTimeInMs = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2);

    const hours = Math.floor(elapsedTimeInMs / (1000 * 60 * 60));
    const minutes = Math.floor(
        (elapsedTimeInMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((elapsedTimeInMs % (1000 * 60)) / 1000);
    const milliseconds = Math.floor(elapsedTimeInMs % 1000);

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds
        .toString()
        .padStart(3, '0')}`;

    return formattedTime;
};
