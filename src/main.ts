import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as path from 'path';
import { mkdir, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { exec } from 'child_process';
import * as bodyParser from 'body-parser';
import { config } from 'dotenv';
config({ path: '.env.sandbox' });

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
  if (process.env.NODE_ENV === 'production') {
    app.useGlobalPipes(
      new ValidationPipe({ disableErrorMessages: true, transform: true })
    );
  } else {
    app.useGlobalPipes(
      new ValidationPipe({ disableErrorMessages: false, transform: true })
    );
  }
  const options = new DocumentBuilder()
    .setTitle('Salmon Stats NEXT WAVE API Documents')
    .setVersion(process.env.API_VER)
    .build();
  const documents = SwaggerModule.createDocument(app, options);
  if (process.env.NODE_ENV !== 'production') {
    const build = path.resolve(process.cwd(), 'docs');
    const output = path.resolve(build, 'index');
    mkdir(build, { recursive: true }, (_) => {});
    writeFileSync(`${output}.json`, JSON.stringify(documents), {
      encoding: 'utf8',
    });
    writeFileSync(`${output}.yaml`, dump(documents, {}));
    exec(`npx redoc-cli build ${output}.json -o ${output}.html`);
  }
  SwaggerModule.setup('documents', app, documents);
  await app.listen(process.env.NODE_PORT || 3000);
}
bootstrap();
