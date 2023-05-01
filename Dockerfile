FROM amd64/node:16.20.0-alpine3.16
ENV NODE_ENV production

WORKDIR /app
COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./prisma ./
COPY --chown=node:node ./tsconfig.json ./
COPY --chown=node:node ./tsconfig.build.json ./
COPY --chown=node:node .nvmrc ./
RUN yarn install --prod --frozen-lockfile
RUN yarn prisma generate
RUN yarn build
USER node
