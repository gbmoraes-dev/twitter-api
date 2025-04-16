import type { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { makeVerifyAccountUseCase } from '@/use-cases/users/factories/make-verify-account'

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

export async function verifyAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const verifyAccountBodySchema = z.object({
    token: z.string(),
  })

  const { token } = verifyAccountBodySchema.parse(request.body)

  try {
    const verifyAccountUseCase = makeVerifyAccountUseCase()

    const { verifiedUser } = await verifyAccountUseCase.execute({ token })

    return reply.status(200).send({ verifiedUser })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
