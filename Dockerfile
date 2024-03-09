FROM oven/bun:1 AS base

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

ENV NODE_ENV=production
ARG APP_PORT APP_HOST APP_VERSION DISCORD_WEBHOOK_URL
ENV APP_PORT=${APP_PORT} APP_HOST=${APP_HOST} APP_VERSION=${APP_VERSION} DISCORD_WEBHOOK_URL=${DISCORD_WEBHOOK_URL}
RUN bunx prisma generate
# RUN bun test
RUN bun run build

# FROM oven/bun:1-distroless AS release
# WORKDIR /app
# COPY --from=install /app/dev/node_modules ./node_modules
# COPY --from=prerelease /app/dist/src ./src
# COPY --from=prerelease /app/dist/views ./views
# COPY --from=prerelease /app/package.json ./package.json
# COPY --from=prerelease /app/tsconfig.json ./tsconfig.json
# ENTRYPOINT [ "bun", "run", "src/main.js" ]

FROM gcr.io/distroless/nodejs20-debian12 AS release
WORKDIR /app
COPY --from=install /app/dev/node_modules ./node_modules
COPY --from=prerelease /app/dist ./dist

# Launch
EXPOSE ${APP_PORT}
CMD ["dist/main"] 
