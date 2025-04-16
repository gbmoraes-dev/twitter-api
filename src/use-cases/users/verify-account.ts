import type { User } from '@/db/schemas'

import type { UsersRepository } from '@/repositories/users.repository'

import { AccountAlreadyVerifiedError } from '../errors/account-already-verified'

interface VerifyAccountUseCaseRequest {
  token: string
}

interface VerifyAccountUseCaseResponse {
  user: User
}

export class VerifyAccountUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    token,
  }: VerifyAccountUseCaseRequest): Promise<VerifyAccountUseCaseResponse> {
    const user = await this.usersRepository.findByVerificationToken(token)

    if (!user) {
      throw new AccountAlreadyVerifiedError()
    }

    const verifiedUser = await this.usersRepository.update(user.id, {
      emailIsVerified: true,
      emailVerificationToken: null,
    })

    return { user: verifiedUser }
  }
}
