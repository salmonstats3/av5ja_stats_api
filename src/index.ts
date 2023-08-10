import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { mkdir, writeFileSync } from "fs";
import { dump } from "js-yaml";
import path from "path";
import { config } from "dotenv";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

config({ path: ".env" });

const build = async () => {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: 50 * 1024 * 1024 }));
    const options = new DocumentBuilder()
        .setTitle(process.env.OPENAPI_TITLE)
        .setDescription(process.env.OPENAPI_DESCRIPTION)
        .setVersion(process.env.API_VER)
        .build();
    const build = path.resolve(process.cwd(), "docs");
    const output = path.resolve(build, "index");
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mkdir(build, { recursive: true }, () => { });
    const config = path.resolve(build, "CNAME")
    const documents = SwaggerModule.createDocument(app, options);
    writeFileSync(config, process.env.OPENAPI_DOC_DOMAIN, {
        encoding: "utf8",
    });
    writeFileSync(`${output}.json`, JSON.stringify(documents), {
        encoding: "utf8",
    });
    writeFileSync(`${output}.yaml`, dump(documents, {}));
}

(async () => await build())();
