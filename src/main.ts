import { exec } from "child_process";
import { mkdir, writeFileSync } from "fs";
import * as path from "path";

import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import { config } from "dotenv";
import { dump } from "js-yaml";

import { AppModule } from "./app.module";
config({ path: ".env.local" });

async function build(documents: OpenAPIObject) {
  const build = path.resolve(process.cwd(), "docs");
  const output = path.resolve(build, "index");
  mkdir(build, { recursive: true }, () => {});
  writeFileSync(`${output}.json`, JSON.stringify(documents), {
    encoding: "utf8",
  });
  writeFileSync(`${output}.yaml`, dump(documents, {}));
  exec(`npx redoc-cli build ${output}.json -o ${output}.html`);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: "5mb" }));
  app.enableCors({
    credentials: false,
    maxAge: 86400,
    optionsSuccessStatus: 200,
    origin: "*",
    preflightContinue: false,
  });
  app.enableVersioning({
    defaultVersion: "1",
    type: VersioningType.URI,
  });
  const disableErrorMessages: boolean = process.env.NODE_ENV === "production";
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: disableErrorMessages,
      transform: true,
    }),
  );
  const options = new DocumentBuilder()
    .setTitle("Salmon Stats+")
    .setDescription(`Salmon Stats for Splatoon 3 API documents. (${process.env.NODE_ENV})`)
    .setVersion(process.env.API_VER)
    .setContact("@Salmonia3Dev", "https://twitter.com/Salmonia3Dev", "nasawake.am@gmail.com")
    .build();
  const documents = SwaggerModule.createDocument(app, options);
  SwaggerModule.createDocument;
  if (!disableErrorMessages) {
    build(documents);
  }
  SwaggerModule.setup("documents", app, documents);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
