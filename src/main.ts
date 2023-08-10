import fastifyHelmet from "@fastify/helmet";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { config } from "dotenv";

import { AppModule } from "./app.module";

config({ path: ".env" });

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: 50 * 1024 * 1024 }));
  app.register(fastifyHelmet);
  app.enableVersioning({ defaultVersion: "1", prefix: "v", type: VersioningType.URI });
  app.enableCors({
    credentials: false,
    maxAge: 86400,
    optionsSuccessStatus: 200,
    origin: "*",
    preflightContinue: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: process.env.NODE_ENV === "production",
      transform: true,
      transformOptions: {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
        ignoreDecorators: true,
      },
    }),
  );

  if (process.env.NODE_ENV !== "production") {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = `credentials.json`;
    const options = new DocumentBuilder()
      .setTitle("Salmon Stats+")
      .setDescription("Salmon Stats for Splatoon 3 API documents.")
      .setVersion(process.env.API_VER)
      .build();
    const documents = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("docs", app, documents);
  } else {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = `/app/credentials.json`;
  }

  await app.listen(process.env.PORT || 3000, "0.0.0.0");
}
bootstrap();
