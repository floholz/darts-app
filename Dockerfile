# syntax=docker/dockerfile:1.4

FROM node:lts-bullseye-slim as builder

LABEL org.opencontainers.image.source=https://github.com/floholz/darts-app
LABEL org.opencontainers.image.description="Dart App container image"

RUN mkdir /darts-app
WORKDIR /darts-app

RUN npm install -g @angular/cli@17

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
CMD ["ng", "serve", "--host", "0.0.0.0"]
