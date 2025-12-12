FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci --only=development

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config

USER node

EXPOSE 8080

CMD ["npm", "run", "start"]
