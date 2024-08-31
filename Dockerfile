FROM node:20.15.0-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM dependencies AS development
COPY --chown=node:node ./ ./
# copy script to install dependencies after container is up
COPY --chown=node:node scripts/install-docker.sh /usr/local/bin/
# give permission to execute the script
RUN chmod +x /usr/local/bin/install-docker.sh
EXPOSE 3001
ENTRYPOINT [ "install-docker.sh" ]
CMD ["npm","start"]

FROM development AS test
COPY --chown=node:node ./ ./
CMD ["npm","run","test"]