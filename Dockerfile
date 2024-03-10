FROM oven/bun:1 AS base

ARG APP_PORT APP_HOST APP_VERSION
ENV APP_PORT=${APP_PORT} APP_HOST=${APP_HOST} APP_VERSION=${APP_VERSION}
ENV NODE_ENV=production

# Development
FROM base AS install 
WORKDIR /app/dev
COPY --from=node:20.11.0 /usr/local/bin/node /usr/local/bin/node
COPY package.json bun.lockb prisma ./
RUN bun install --frozen-lockfile
RUN bunx prisma generate

# Production
WORKDIR /app/prod
COPY package.json bun.lockb ./ 
RUN bun install --frozen-lockfile --production --ignore-scripts

# Pre Release
FROM base AS prerelease 
WORKDIR /app
COPY --from=node:20.11.0 /usr/local/bin/node /usr/local/bin/node
COPY --from=install /app/dev/node_modules node_modules
COPY . .

RUN bunx prisma generate
RUN bun run build

FROM gcr.io/distroless/nodejs20-debian12 AS release
WORKDIR /app
COPY --from=install /app/dev/node_modules ./node_modules
COPY --from=prerelease /app/dist ./dist

# Launch
EXPOSE ${APP_PORT}
CMD ["dist/main"] 
