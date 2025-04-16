import { env } from '@/env'

import type { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true })

    const token = await reply.jwtSign({
      sub: request.user.sub,
      emailIsVerified: request.user.emailIsVerified,
    })

    const refreshToken = await reply.jwtSign(
      {
        sub: request.user.sub,
        emailIsVerified: request.user.emailIsVerified,
      },
      {
        expiresIn: '7d',
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: env.NODE_ENV === 'production',
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (error) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
