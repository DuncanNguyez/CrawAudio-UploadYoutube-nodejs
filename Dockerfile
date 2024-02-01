FROM node:20.5.0
WORKDIR .
COPY --from=mwader/static-ffmpeg:6.0-1 /ffmpeg /usr/local/bin/
COPY . .
ENTRYPOINT ["npm","run","prod"]