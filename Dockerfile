FROM node:18.17.1 AS build
WORKDIR /tmp

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
WORKDIR /tmp

COPY  ./package.json ./
COPY  ./yarn.lock ./
COPY  ./tsconfig.json ./
COPY  ./tsconfig.build.json ./
COPY  ./prisma ./prisma
COPY  ./nest-cli.json ./

RUN yarn install --prod
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" /dev/null
COPY  ./src ./src
RUN yarn prisma generate

FROM node:18.17.1-slim AS dist
ARG VIRTUAL_PORT
WORKDIR /app

RUN apt-get update -y
RUN apt-get install -y openssl
COPY --from=build /tmp/dist ./dist
COPY --from=build /tmp/prisma ./prisma
COPY --from=build /tmp/package.json ./
COPY --from=module /tmp/node_modules ./node_modules

EXPOSE ${VIRTUAL_PORT}
CMD ["node", "dist/main"]
