import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as path from 'path';
import { mkdir, writeFileSync } from 'fs';
import { exec } from 'child_process';
import * as bodyParser from 'body-parser';
import { config } from 'dotenv';
config({ path: '.env.sandbox' });

async function build(documents: OpenAPIObject) {
  const build = path.resolve(process.cwd(), 'docs');
  const output = path.resolve(build, 'index');
  mkdir(build, { recursive: true }, (_) => {});
  writeFileSync(`${output}.json`, JSON.stringify(documents), {
    encoding: 'utf8',
  });
  const dump = require('js-yaml').dump;
  writeFileSync(`${output}.yaml`, dump(documents, {}));
  exec(`npx redoc-cli build ${output}.json -o ${output}.html`);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '5mb' }));
  app.enableCors({
    origin: '*',
    maxAge: 86400,
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  const disableErrorMessages: boolean = process.env.NODE_ENV === 'production';
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: disableErrorMessages,
      transform: true,
    })
  );
  const options = new DocumentBuilder()
    .setTitle('Salmon Stats+')
    .setDescription(
      `Salmon Stats for Splatoon 3 API documents. (${process.env.NODE_ENV})`
    )
    .setVersion(process.env.ENVIRONMENT)
    .setContact(
      '@Salmonia3Dev',
      'https://twitter.com/Salmonia3Dev',
      'nasawake.am@gmail.com'
    )
    .build();
  const documents = SwaggerModule.createDocument(app, options);
  SwaggerModule.createDocument;
  if (!disableErrorMessages) {
    build(documents);
  }
  SwaggerModule.setup('documents', app, documents);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
