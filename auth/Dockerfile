FROM oven/bun:1.2.4 AS base
WORKDIR /usr/src/app

COPY . .
RUN bun install --production --frozen-lockfile

EXPOSE 80
WORKDIR /usr/src/app/auth
ENTRYPOINT [ "bun", "run", "index.ts" ]