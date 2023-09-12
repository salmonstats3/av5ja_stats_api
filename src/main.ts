import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { LogLevel } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const server = fastify();
  server.register(fastifyCors);
    server.addHook('onRequest', (request, reply, done) => {
    const replyUnknown = reply as any;
    replyUnknown['setHeader'] = reply.header.bind(reply);
    replyUnknown['end'] = reply.send.bind(reply);
    done();
  });
  const adapter = new FastifyAdapter();
  const logLevels: LogLevel[] = ["log", "error", "warn"];
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    logger: logLevels,
  });
}
bootstrap();
