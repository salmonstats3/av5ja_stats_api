import { exec } from 'child_process';
import { mkdir, writeFileSync } from 'fs';
import * as path from 'path';

import { LogLevel, VersioningType, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import fastify from 'fastify';
import { dump } from 'js-yaml';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

import { AppModule } from './app.module';
import { onSend, preValidation } from './fastify/log';

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
  // ログレベル
  const logLevels: LogLevel[] = isDevelopment ? ['log', 'error', 'warn', 'debug', 'verbose'] : ['log', 'error', 'warn'];
  // ログ出力
  server.addHook('preValidation', preValidation);
  server.addHook('onSend', onSend);
  server.addHook('onRequest', (request, reply, done) => {
    const replyUnknown = reply as any;
    replyUnknown['setHeader'] = reply.header.bind(reply);
    replyUnknown['end'] = reply.send.bind(reply);
    done();
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const adapter = new FastifyAdapter(server);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    logger: logLevels,
  });
  // 設定ファイル読み込み
  const config = app.get(ConfigService);
  // バージョンとCORSの設定
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });
  app.enableCors({
    allowedHeaders:
      'X-Web-View-Ver, X-GameWebToken, X-NaCountry, X-ProductVersion, X-Platform, X-Znca-Platform, X-Znca-Version, Origin, Content-Type, Accept, Authorization',
    credentials: false,
    maxAge: 86400,
    optionsSuccessStatus: 200,
    origin: '*',
    preflightContinue: false,
  });
  // フィルターの追加(意味はよくわかっていない)
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  // バリデーション時に変換する
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
        ignoreDecorators: true,
      },
    }),
  );

  // 環境変数を読み込んで値がなければエラーを返す
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
  // 開発環境時はSwaggerを有効にする
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

  // アプリを起動
  await app.listen(port, host);
}
bootstrap();
