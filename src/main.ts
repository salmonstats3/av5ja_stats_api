import { exec } from "child_process";
import { mkdir, writeFileSync } from "fs";
import path from "path";

import fastifyHelmet from "@fastify/helmet";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from "@nestjs/swagger";
import { config } from "dotenv";
import { dump } from "js-yaml";

import { AppModule } from "./app.module";


config({ path: ".env" });

function build(documents: OpenAPIObject) {
  const build = path.resolve(process.cwd(), "docs");
  const output = path.resolve(build, "index");
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mkdir(build, { recursive: true }, () => {});
  writeFileSync(`${output}.json`, JSON.stringify(documents), {
    encoding: "utf8",
  });
  writeFileSync(`${output}.yaml`, dump(documents, {}));
  exec(`npx redoc-cli build ${output}.json -o ${output}.html`);
}

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
