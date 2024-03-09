import { plainToInstance } from 'class-transformer'
import { IsEnum, IsIP, IsInt, IsNotEmpty, IsNumber, IsSemVer, IsUrl, Max, Min, validateSync } from 'class-validator'
import * as dotenv from 'dotenv'

enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export class NestConfig {
  @IsEnum(NodeEnv)
  private readonly NODE_ENV: NodeEnv

  @IsNumber()
  @IsInt()
  @Max(65535)
  @Min(0)
  readonly APP_PORT: number = 3333

  @IsNotEmpty()
  @IsIP()
  readonly APP_HOST: string = '0.0.0.0'

  @IsSemVer()
  readonly APP_VERSION: string

  @IsUrl()
  readonly WEBHOOK_URL: string

  get isDevelopment(): boolean {
    return this.NODE_ENV == NodeEnv.DEVELOPMENT
  }
}

export const configuration = (() => {
  dotenv.config({ override: true, path: '.env' })
  const configuration = plainToInstance(
    NestConfig,
    {
      APP_HOST: process.env.APP_HOST,
      APP_PORT: process.env.APP_PORT,
      APP_VERSION: process.env.APP_VERSION,
      NODE_ENV: process.env.NODE_ENV,
      WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
    },
    { enableImplicitConversion: true },
  )
  const errors = validateSync(configuration, { skipMissingProperties: false })
  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return configuration
})()
