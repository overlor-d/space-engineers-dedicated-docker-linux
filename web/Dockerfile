FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache docker-cli curl

RUN mkdir -p ~/.docker/cli-plugins/ \
    && curl -SL https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64 \
    -o ~/.docker/cli-plugins/docker-compose \
    && chmod +x ~/.docker/cli-plugins/docker-compose

RUN docker compose version

COPY package.json ./
RUN npm install
COPY . .

RUN chmod +x /app/entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/app/entrypoint.sh"]
