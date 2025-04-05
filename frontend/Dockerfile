FROM oven/bun:1.2.4 AS base
WORKDIR /usr/src/app

COPY . .
RUN bun install --frozen-lockfile

EXPOSE 80
WORKDIR /usr/src/app/frontend
RUN bun run build
ENTRYPOINT [ "bun", "run", "server.ts" ]