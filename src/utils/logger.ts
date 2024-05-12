import { Logger } from "@nestjs/common"
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify"

const logger = new Logger("FastifyServer")

/**
 * Log preValidation
 * @param request Request
 * @param reply Reply
 * @param done Done function
 */
export const preValidation = (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
  const { url, method, params, query, headers, body } = request
  const data = { body, headers, method, params, query, url }
  logger.verbose(`HTTP onRequest:\n${JSON.stringify(data, null, 2)}`)
  done()
}

/**
 * Log onSend
 * @param request Request
 * @param reply Reply
 * @param payload Payload
 * @param done Done function
 */
export const onSend = (
  request: FastifyRequest,
  reply: FastifyReply,
  payload: unknown,
  done: HookHandlerDoneFunction
) => {
  let body
  if (typeof payload === "string") {
    try {
      body = JSON.parse(payload)
    } catch (e) {
      body = payload
    }
  } else if (payload) {
    body = `[${(payload as any).constructor.name}]`
  }
  const data = { body, headers: reply.getHeaders() }
  logger.verbose(`HTTP onSend:\n${JSON.stringify(data, null, 2)}`)
  done()
}
