import { LogLevel, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import fastify from 'fastify';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

import { AppModule } from './app.module';
import { ceil } from './helper';

async function bootstrap() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const server = fastify({ bodyLimit: 50 * 1024 * 1024 });
  const logLevels: LogLevel[] = isDevelopment ? ['log', 'error', 'warn', 'debug', 'verbose'] : ['log', 'error', 'warn'];
  // server.addHook('preValidation', preValidation);
  // server.addHook('onSend', onSend);
  // server.addHook('onRequest', (request, reply, done) => {
  //   const replyUnknown = reply as any;
  //   replyUnknown['setHeader'] = reply.header.bind(reply);
  //   replyUnknown['end'] = reply.send.bind(reply);
  //   done();
  // });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const adapter = new FastifyAdapter(server);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    logger: logLevels,
  });

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(ceil);
  dayjs.tz.setDefault('Asia/Tokyo');

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

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: !isDevelopment,
      transform: true,
      transformOptions: {
        excludeExtraneousValues: true,
        exposeDefaultValues: false,
        ignoreDecorators: false,
      },
      validateCustomDecorators: true,
    }),
  );

  const config = app.get(ConfigService);
  const configuration = {
    host: config.get<string>('API_HOST'),
    port: config.get<number>('API_PORT'),
    version: config.get<string>('API_VERSION'),
  };
  if (configuration.version === undefined) {
    throw new Error('API_VERSION is not defined.');
  }
  if (configuration.host === undefined) {
    throw new Error('API_HOST is not defined.');
  }
  if (configuration.port === undefined) {
    throw new Error('API_PORT is not defined.');
  }

  if (isDevelopment) {
    const documentConfig = new DocumentBuilder()
      .setTitle('Salmon Stats+')
      .setDescription('Salmon Stats for Splatoon 3 API documents.')
      .setVersion(configuration.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(configuration.port || 3000, configuration.host || '0.0.0.0');
}
bootstrap();
