FROM node:20.5.0
FROM linuxserver/ffmpeg:version-6.0-cli
WORKDIR .
COPY . .
ENTRYPOINT ["npm","run","prod"]
