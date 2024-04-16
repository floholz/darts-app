# syntax=docker/dockerfile:1.4

LABEL org.opencontainers.image.source=https://github.com/floholz/darts-app
LABEL org.opencontainers.image.description="Dart App container image"

FROM node:lts-bullseye-slim as builder

RUN mkdir /darts-app
WORKDIR /darts-app

RUN npm install -g @angular/cli@17

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
CMD ["ng", "serve", "--host", "0.0.0.0"]

FROM builder as dev-envs

RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /

CMD ["ng", "serve", "--host", "0.0.0.0", "--production"]
