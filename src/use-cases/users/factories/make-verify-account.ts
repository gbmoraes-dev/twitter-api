import { UsersDrizzleRepository } from '@/repositories/drizzle/users.drizzle.repository'

import { VerifyAccountUseCase } from '../verify-account'

export function makeVerifyAccountUseCase() {
  const usersRepository = new UsersDrizzleRepository()
  const verifyAccountUseCase = new VerifyAccountUseCase(usersRepository)

  return verifyAccountUseCase
}
