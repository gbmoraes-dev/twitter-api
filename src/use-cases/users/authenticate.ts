import * as bcryptjs from 'bcryptjs'

import type { User } from '@/db/schemas'

import type { UsersRepository } from '@/repositories/users.repository'

import { InvalidCredentialsError } from '../errors/invalid-credentials'

import { AccountNotVerifiedError } from '../errors/account-not-verified'

interface AuthenticateUseCaseRequest {
  username: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    username,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    if (!user.emailIsVerified) {
      throw new AccountNotVerifiedError()
    }

    const doesPasswordMatches = await bcryptjs.compare(
      password,
      user.passwordHash,
    )

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
