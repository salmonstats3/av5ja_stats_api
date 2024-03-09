import { Controller, Get, Header, Render, Version } from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'

import { AppService } from '@/app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('docs')
  @Render('redoc.hbs')
  @Header(
    'Content-Security-Policy',
    "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; child-src * 'unsafe-inline' 'unsafe-eval' blob:; worker-src * 'unsafe-inline' 'unsafe-eval' blob:; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';",
  )
  @ApiExcludeEndpoint()
  @Version('3')
  docs() {
    return {
      data: {
        docUrl: '/api-json',
        options: JSON.stringify({
          hideDownloadButton: false,
          hideHostname: false,
          noAutoAuth: true,
          pathInMiddlePanel: true,
          sortPropsAlphabetically: true,
          theme: {
            logo: {
              gutter: '15px',
            },
          },
        }),
      },
    }
  }
}
