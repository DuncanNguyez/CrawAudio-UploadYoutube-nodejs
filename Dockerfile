FROM node:20.5.0
FROM linuxserver/ffmpeg:06.12.23
WORKDIR .
COPY . .
ENTRYPOINT ["npm","run","prod"]
