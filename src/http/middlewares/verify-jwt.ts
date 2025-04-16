import type { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()

    if (!request.user.emailIsVerified) {
      return reply.status(403).send({
        message: 'Account not verified.',
      })
    }
  } catch (error) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
