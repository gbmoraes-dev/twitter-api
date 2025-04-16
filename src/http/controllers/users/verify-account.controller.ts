import type { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { makeVerifyAccountUseCase } from '@/use-cases/users/factories/make-verify-account'

import { AccountAlreadyVerifiedError } from '@/use-cases/errors/account-already-verified'

export async function verifyAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const verifyAccountBodySchema = z.object({
    token: z.string(),
  })

  const { token } = verifyAccountBodySchema.parse(request.body)

  try {
    const registerUseCase = makeVerifyAccountUseCase()

    const { user } = await registerUseCase.execute({
      token,
    })

    return reply.status(200).send({ user })
  } catch (error) {
    if (error instanceof AccountAlreadyVerifiedError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
