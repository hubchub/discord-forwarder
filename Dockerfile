FROM node:18.14.1-alpine AS build

RUN mkdir -p /app
WORKDIR /app

COPY . /app
RUN rm -rf /app/node_modules

RUN npm ci

CMD ["node", "src/index.js"]

