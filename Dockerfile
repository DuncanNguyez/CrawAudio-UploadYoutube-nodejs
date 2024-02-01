FROM node:20.5.0
WORKDIR .
COPY . .
ENTRYPOINT ["npm","run","prod"]
