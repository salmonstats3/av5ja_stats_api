FROM node:18.17.1 AS build
WORKDIR /build

COPY  ./package.json ./
COPY  ./yarn.lock ./
COPY  ./tsconfig.json ./
COPY  ./tsconfig.build.json ./
COPY  ./prisma ./prisma
COPY  ./nest-cli.json ./

RUN yarn install
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" /dev/null
COPY  ./src ./src
RUN yarn prisma generate
RUN yarn build

FROM node:18.17.1 AS module
WORKDIR /module

COPY  ./package.json ./
COPY  ./yarn.lock ./
COPY  ./tsconfig.json ./
COPY  ./tsconfig.build.json ./
COPY  ./prisma ./prisma
COPY  ./nest-cli.json ./

RUN yarn install --prod
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" /dev/null
COPY  ./src ./src
RUN npx prisma generate

FROM gcr.io/distroless/nodejs18-debian12 AS dist
ARG VIRTUAL_PORT
WORKDIR /app

COPY --from=build /build/dist ./dist
COPY --from=build /build/prisma ./prisma
COPY --from=build /build/package.json ./
COPY --from=module /module/node_modules ./node_modules

EXPOSE ${VIRTUAL_PORT}
CMD ["dist/src/main"]
