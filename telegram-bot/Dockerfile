FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.json ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# NODE_ENV should be set in App Runner environment variables

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/out ./out
COPY image ./image

EXPOSE 3001

CMD ["npm", "start"]
