import type { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { env } from '@/env'

import { makeAuthenticateUseCase } from '@/use-cases/users/factories/make-authenticate'

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials'

import { AccountNotVerifiedError } from '@/use-cases/errors/account-not-verified'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    username: z.string(),
    password: z.string().min(6),
  })

  const { username, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      username,
      password,
    })

    const token = await reply.jwtSign({
      sub: user.id,
      emailIsVerified: user.emailIsVerified,
    })

    const refreshToken = await reply.jwtSign(
      {
        sub: user.id,
        emailIsVerified: user.emailIsVerified,
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
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof AccountNotVerifiedError) {
      return reply.status(403).send({ message: error.message })
    }

    throw error
  }
}
