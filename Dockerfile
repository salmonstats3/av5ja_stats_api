FROM amd64/node:18.17.1-alpine3.18

WORKDIR /app

COPY  ./package.json ./
COPY  ./yarn.lock ./
COPY  ./tsconfig.json ./
COPY  ./tsconfig.build.json ./
COPY  ./prisma ./
COPY  ./src ./
COPY  ./nest-cli.json ./

RUN yarn install && yarn cache clean --all
RUN yarn prisma generate
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" /dev/null
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start:prod"]