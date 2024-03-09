import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { InjectMetric } from '@willsoto/nestjs-prometheus'
import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaService } from 'nestjs-prisma'
import { Counter, Gauge, Summary } from 'prom-client'

import { route, semantic } from '@/utils/regexp'

@Injectable()
export class MetrictMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric('request_duration')
    public total_request_duration: Summary<string>,
    @InjectMetric('total_request_count')
    public total_request_count: Counter<string>,
    @InjectMetric('total_request_count_by_user_agent')
    public total_request_count_by_user_agent: Counter<string>,
    @InjectMetric('total_results_count')
    public total_results_count: Gauge<string>,
    private readonly prisma: PrismaService,
  ) {}

  use(request: FastifyRequest, response: FastifyReply['raw'], next: () => void): void {
    const requestTime: [number, number] = process.hrtime()
    const { method, originalUrl } = request
    const userAgent = request.headers['user-agent']
    const host: string = request.headers['host']
    const referer: string = request.headers['referer']
    const [, version, path] = route.exec(originalUrl)

    // Check if the request is coming from the API or if the User-Agent is a bot
    if (referer != `${request.protocol}://${host}/api` && !semantic.test(userAgent) && false) {
      throw new HttpException('Malformed User-Agent.', HttpStatus.BAD_REQUEST)
    }
    response.on('finish', async () => {
      const { statusCode } = response
      const diffTime = process.hrtime(requestTime)
      const processingTime = diffTime[0] * 1e3 + diffTime[1] * 1e-6
      if (path.includes('results')) {
        const count: number = await this.prisma.result.count()
        this.total_results_count.set(count)
      }
      this.total_request_count_by_user_agent.inc({ user_agent: userAgent })
      this.total_request_count.inc({
        method,
        status: statusCode,
        url: `${version}/${path}`,
      })
      this.total_request_duration.observe({ method, status: statusCode }, processingTime)
    })
    next()
  }
}
