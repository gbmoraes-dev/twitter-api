import type { User } from '@/db/schemas'

import type { UsersDrizzleRepository } from '@/repositories/drizzle/users.drizzle.repository'

import { ResourceNotFoundError } from '../errors/resource-not-found'

import { AccountAlreadyVerifiedError } from '../errors/account-already-verified'

interface VerifyAccountUseCaseRequest {
  token: string
}

interface VerifyAccountUseCaseResponse {
  verifiedUser: User
}

export class VerifyAccountUseCase {
  constructor(private readonly usersRepository: UsersDrizzleRepository) {}

  async execute({
    token,
  }: VerifyAccountUseCaseRequest): Promise<VerifyAccountUseCaseResponse> {
    const user = await this.usersRepository.findByVerificationToken(token)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (user.emailIsVerified) {
      throw new AccountAlreadyVerifiedError()
    }

    const verifiedUser = await this.usersRepository.update(user.id, {
      emailIsVerified: true,
      emailVerificationToken: null,
    })

    return {
      verifiedUser,
    }
  }
}
