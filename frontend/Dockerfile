# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS build
RUN mkdir -p /temp/prod
COPY . /temp/prod/
# TODO: include lockfile and --frozen-lockfile
RUN cd /temp/prod && bun install
RUN cd /temp/prod && bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=build /temp/prod/dist dist
RUN bun install -g serve

# run the app
USER bun
EXPOSE 80
CMD [ "bunx", "serve", "-p", "80", "-s", "dist" ]