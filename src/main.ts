import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { LogLevel, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from "@nestjs/swagger";
import { mkdir, writeFileSync } from "fs";
import { exec } from "child_process";
import * as path from "path";
import { dump } from 'js-yaml';
import { onSend, preValidation } from "./fastify/log";

const build = (documents: OpenAPIObject) => {
  const build = path.resolve(process.cwd(), 'docs');
  const output = path.resolve(build, 'index');
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mkdir(build, { recursive: true }, () => {});
  writeFileSync(`${output}.json`, JSON.stringify(documents), {
    encoding: 'utf8',
  });
  writeFileSync(`${output}.yaml`, dump(documents, {}));
  exec(`npx redoc-cli build ${output}.json -o ${output}.html`);
};

async function bootstrap() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const server = fastify();
  const logLevels: LogLevel[] = isDevelopment 
  ? ["log", "error", "warn" , "debug", "verbose"]
  : ["log", "error", "warn"]
    server.addHook('preValidation', preValidation);
  server.addHook('onSend', onSend);
  // @ts-ignore
  const adapter = new FastifyAdapter(server);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    logger: logLevels,
  });
  const config = app.get(ConfigService)
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1'})
      app.enableCors({
        allowedHeaders:
            'X-Web-View-Ver, X-GameWebToken, X-NaCountry, X-ProductVersion, X-Platform, X-Znca-Platform, X-Znca-Version, Origin, Content-Type, Accept, Authorization',
        credentials: false,
        maxAge: 86400,
        optionsSuccessStatus: 200,
        origin: '*',
        preflightContinue: false,
    });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      },
    }),
  );

  const version = config.get<string>('API_VERSION');
  const port = config.get<number>('API_PORT');
  const host = config.get<string>('API_HOST');

  if (port === Number.NaN) {
    throw new Error('API_PORT is not a number');
  }
  if (host === undefined) {
    throw new Error('API_HOST is not defined');
  }
if (version === undefined) {
    throw new Error('API_VERSION is not defined');
  }
  if (isDevelopment) {
      const documentConfig = new DocumentBuilder()
      .setTitle('Salmon Stats+')
      .setDescription('Salmon Stats for Splatoon 3 API documents.')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, documentConfig);
    build(document);
    SwaggerModule.setup('docs', app, document);
  }

    await app.listen(port, host);
}
bootstrap();
