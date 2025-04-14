import * as bcryptjs from 'bcryptjs'

import { randomBytes } from 'node:crypto'

import { logger } from '@/logger'

import type { User } from '@/db/schemas'

import type { UsersRepository } from '@/repositories/users.repository'

import { UsernameAlreadyExistsError } from '../errors/username-already-exists'

import { EmailAlreadyExistsError } from '../errors/email-already-exists'

import { sendToQueue } from '@/lib/queue/producer'

interface RegisterUseCaseRequest {
  firstName: string
  lastName?: string
  bio?: string
  username: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    firstName,
    lastName,
    bio,
    username,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const usernameAlreadyExists =
      await this.usersRepository.findByUsername(username)

    if (usernameAlreadyExists) {
      throw new UsernameAlreadyExistsError()
    }

    const emailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const hash = await bcryptjs.hash(password, 6)

    const token = randomBytes(3).toString('hex').toUpperCase()

    const user = await this.usersRepository.create({
      firstName,
      lastName,
      bio,
      username,
      email,
      passwordHash: hash,
      emailVerificationToken: token,
    })

    await sendToQueue('user_created', {
      email: user.email,
      name: user.firstName,
      token: user.emailVerificationToken,
    }).catch((error) => logger.error('Error sending email to queue', error))

    return {
      user,
    }
  }
}
