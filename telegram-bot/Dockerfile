FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.json ./
COPY image ./image

EXPOSE 3000

CMD ["npm", "start"]
