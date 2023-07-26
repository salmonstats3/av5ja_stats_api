import { ApiProperty } from "@nestjs/swagger"

export class APIConfig {
    @ApiProperty({ example: '2.6.0' })
    version: string

    @ApiProperty({ example: '4.0.0-22ddb0fd' })
    web_version: string

    @ApiProperty({ example: '3fd9788e' })
    hash: string
}