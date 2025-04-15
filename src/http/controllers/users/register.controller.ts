import type { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { makeRegisterUseCase } from '../../../use-cases/users/factories/make-register'

import { UsernameAlreadyExistsError } from '../../../use-cases/errors/username-already-exists'

import { EmailAlreadyExistsError } from '../../../use-cases/errors/email-already-exists'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    bio: z.string().optional(),
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const { firstName, lastName, bio, username, email, password } =
    registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    const user = await registerUseCase.execute({
      firstName,
      lastName,
      bio,
      username,
      email,
      password,
    })

    return reply.status(201).send({ user })
  } catch (error) {
    if (error instanceof UsernameAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
