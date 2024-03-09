import { Injectable, NestMiddleware } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

@Injectable()
export class ResultsMiddleware implements NestMiddleware {
  use(request: FastifyRequest, response: FastifyReply['raw'], next: () => void): void {
    next()
  }
}
