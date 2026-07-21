FROM node:20.18.0-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

RUN npm run build

EXPOSE 10000
ENV PORT=10000
CMD ["npm", "run", "start"]