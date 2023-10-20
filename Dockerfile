FROM node:18.17.1 AS build
WORKDIR /tmp

COPY  ./package.json ./
COPY  ./yarn.lock ./
COPY  ./tsconfig.json ./
COPY  ./tsconfig.build.json ./
COPY  ./prisma ./prisma
COPY  ./src ./src
COPY  ./nest-cli.json ./

RUN yarn install
RUN yarn prisma generate
RUN yarn build

FROM node:18.17.1 AS module
WORKDIR /tmp

COPY  ./package.json ./
COPY  ./yarn.lock ./
COPY  ./tsconfig.json ./
COPY  ./tsconfig.build.json ./
COPY  ./prisma ./prisma
COPY  ./src ./src
COPY  ./nest-cli.json ./

RUN yarn install --prod
RUN yarn prisma generate

FROM node:18.17.1-alpine3.18 AS dist
WORKDIR /app

COPY --from=build /tmp/dist ./dist
COPY --from=build /tmp/prisma ./prisma
COPY --from=build /tmp/package.json ./
COPY --from=module /tmp/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main"]
