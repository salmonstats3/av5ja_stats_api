FROM node:20.10.0 AS build
WORKDIR /build

COPY  ./package.json ./
COPY  ./yarn.lock ./
COPY  ./tsconfig.json ./
COPY  ./tsconfig.build.json ./
COPY  ./prisma ./prisma
COPY  ./nest-cli.json ./

RUN yarn set version 1.22.19
RUN yarn -v
RUN yarn install
COPY  ./src ./src
RUN yarn prisma generate
RUN yarn build

FROM node:20.10.0 AS module
WORKDIR /module

COPY  ./package.json ./
COPY  ./yarn.lock ./
COPY  ./tsconfig.json ./
COPY  ./tsconfig.build.json ./
COPY  ./prisma ./prisma
COPY  ./nest-cli.json ./

RUN yarn set version 1.22.19
RUN yarn install --prod
COPY  ./src ./src
RUN npx prisma generate

FROM gcr.io/distroless/nodejs20-debian12 AS dist
ARG API_PORT
WORKDIR /app

COPY --from=build /build/dist ./dist
COPY --from=build /build/prisma ./prisma
COPY --from=build /build/package.json ./
COPY --from=module /module/node_modules ./node_modules

EXPOSE ${API_PORT}
CMD ["dist/src/main"]
