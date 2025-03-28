# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/prod
# TODO: include lockfile and --frozen-lockfile
COPY package.json /temp/prod/
RUN cd /temp/prod && bun install --production

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# run the app
USER bun
EXPOSE 3001
ENTRYPOINT [ "bun", "run", "index.ts" ]