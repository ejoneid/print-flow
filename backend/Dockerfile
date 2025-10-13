FROM oven/bun:1.3.0 AS base
WORKDIR /usr/src/app

COPY . .
RUN bun install --production --frozen-lockfile

EXPOSE 80
WORKDIR /usr/src/app/backend
ENTRYPOINT [ "bun", "run", "index.ts" ]
