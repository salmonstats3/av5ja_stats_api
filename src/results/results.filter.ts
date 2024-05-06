import { HttpService } from '@nestjs/axios'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import dayjs from 'dayjs'
import { lastValueFrom } from 'rxjs'

import { configuration } from '@/utils/validator'

@Catch()
export class ResultsFilter implements ExceptionFilter {
  constructor(
    private readonly host: HttpAdapterHost,
    private readonly axios: HttpService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.host
    const ctx = host.switchToHttp()
    const except: HttpException =
      exception instanceof HttpException ? exception : new HttpException(exception, HttpStatus.INTERNAL_SERVER_ERROR)
    const status = except.getStatus()

    const results: any[] = ctx.getRequest().body.results
    if (results !== undefined) {
      const nplnUserId: string = results[0].id.nplnUserId
      const messages: string[] = (except.getResponse() as any).message as string[]
      if (status !== HttpStatus.SERVICE_UNAVAILABLE) {
        this.send(status, except.message, nplnUserId, messages, results)
      }
    }

    const response = exception.getResponse()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // delete response.message
    httpAdapter.reply(ctx.getResponse(), response, status)
  }

  private async send(status: number, title: string, nplnUserId: string, messages: string[], results: any[]) {
    const url: string = configuration.WEBHOOK_URL
    const content = {
      embeds: [
        {
          author: {
            name: `@${nplnUserId}`,
          },
          color: 5620992,
          fields: [
            {
              inline: true,
              name: 'Status',
              value: status.toString(),
            },
            {
              inline: true,
              name: 'Environment',
              value: configuration.isDevelopment ? 'Development' : 'Production',
            },
            {
              name: 'Errors',
              value: messages.join('\n'),
            },
          ],
          footer: {
            text: dayjs().utc().toISOString(),
          },
          title: title,
        },
      ],
    }
    const formData = new FormData()
    formData.append(
      'file',
      new Blob([JSON.stringify({ results: results })], {
        type: 'application/json',
      }),
      'results.json',
    )
    formData.append('payload_json', JSON.stringify(content))
    lastValueFrom(
      this.axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    )
  }
}
