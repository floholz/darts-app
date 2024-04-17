# Stage 1: Build an Angular Docker Image
FROM node:lts-bullseye-slim as build
LABEL org.opencontainers.image.source=https://github.com/floholz/darts-app
LABEL org.opencontainers.image.description="Dart App container image"
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY . /app

RUN npm run build:prod
# Stage 2, use the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/out/ /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
