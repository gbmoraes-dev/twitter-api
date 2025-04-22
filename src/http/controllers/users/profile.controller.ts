import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeUserProfileUseCase } from '@/use-cases/users/factories/make-profile'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password: undefined,
    },
  })
}
