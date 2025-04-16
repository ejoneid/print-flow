# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.8 AS base
WORKDIR /usr/src/app

COPY . .
RUN bun install --production --frozen-lockfile

EXPOSE 80
WORKDIR /usr/src/app/backend
ENTRYPOINT [ "bun", "run", "index.ts" ]