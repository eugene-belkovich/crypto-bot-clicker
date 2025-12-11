FROM node:20-alpine3.21

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "dev"]
