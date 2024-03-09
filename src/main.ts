import { join } from 'path'

import { LogLevel, ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import fastify from 'fastify'
import * as SwaggerStats from 'swagger-stats'
import { SwaggerTheme } from 'swagger-themes'
import { SwaggerThemeNameEnum } from 'swagger-themes/build/enums/swagger-theme-name'

import content from '@/../package.json'
import { AppModule } from '@/app.module'
import { ceil } from '@/utils/dayjs'
import { configuration } from '@/utils/validator'

async function bootstrap() {
  const server = fastify({ bodyLimit: 50 * 1024 * 1024 })
  const logLevels: LogLevel[] = configuration.isDevelopment
    ? ['log', 'error', 'warn', 'debug', 'verbose']
    : ['log', 'error', 'warn']
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(server), {
    logger: logLevels,
  })

  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.extend(ceil)
  dayjs.tz.setDefault('Asia/Tokyo')

  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI })
  app.enableCors({
    credentials: false,
    maxAge: 86400,
    optionsSuccessStatus: 200,
    origin: '*',
    preflightContinue: false,
  })
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      transform: true,
      transformOptions: {
        excludeExtraneousValues: true,
        exposeDefaultValues: false,
        exposeUnsetFields: false,
        ignoreDecorators: false,
      },
      validateCustomDecorators: true,
    }),
  )
  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '@/', 'views'),
  })
  const builder = new DocumentBuilder()
    .setTitle(content.name)
    .setDescription(content.description)
    .setVersion(content.version)
    .addGlobalParameters({
      description: 'Following the semantic versioning.',
      example: `av5ja/${content.version}`,
      in: 'header',
      name: 'User-Agent',
      required: true,
      schema: { type: 'string' },
    })
    .build()
  const document = SwaggerModule.createDocument(app, builder)
  const theme = new SwaggerTheme()
  const options = theme.getDefaultConfig(SwaggerThemeNameEnum.DARK)
  app.use(
    SwaggerStats.getMiddleware({
      swaggerOnly: true,
      swaggerSpec: document,
      version: content.version,
    }),
  )
  SwaggerModule.setup('api', app, document, options)
  await app.listen(configuration.APP_PORT, configuration.APP_HOST)
}
bootstrap()
