FROM node:20.18.0-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3001
CMD ["npm", "run", "dev"]