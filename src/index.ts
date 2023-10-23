import { mkdir, writeFileSync } from 'fs';
import path from 'path';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { config } from 'dotenv';
import { dump } from 'js-yaml';

import content from '../package.json';

import { AppModule } from './app.module';
import { ceil } from './helper';
config({ path: '.env' });

const build = async () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(ceil);
  dayjs.tz.setDefault('Asia/Tokyo');

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: 50 * 1024 * 1024 }));
  const options = new DocumentBuilder()
    .setTitle(content.name)
    .setDescription(content.description)
    .setVersion(content.version)
    .addBearerAuth()
    .build();
  const build = path.resolve(process.cwd(), 'docs');
  const output = path.resolve(build, 'index');
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mkdir(build, { recursive: true }, () => {});
  const config = path.resolve(build, 'CNAME');
  const documents = SwaggerModule.createDocument(app, options);
  writeFileSync(config, 'docs.splatnet3.com', {
    encoding: 'utf8',
  });
  writeFileSync(`${output}.json`, JSON.stringify(documents), {
    encoding: 'utf8',
  });
  writeFileSync(`${output}.yaml`, dump(documents, {}));
};

(async () => await build())();
