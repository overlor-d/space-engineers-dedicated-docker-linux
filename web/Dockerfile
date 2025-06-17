FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache docker-cli docker-compose
COPY package.json ./
RUN npm install
COPY . .
RUN chmod +x /app/entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/app/entrypoint.sh"]
