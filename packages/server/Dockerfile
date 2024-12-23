FROM node:22 AS base

WORKDIR /app
COPY tsconfig.json ./
COPY package*.json ./
RUN npm install
EXPOSE 8000

FROM base AS dev
CMD ["npm", "run", "start-dev"]

FROM base AS prod
COPY src/ ./src/
RUN npm run build
CMD ["npm","start"]
