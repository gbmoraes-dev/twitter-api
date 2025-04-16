import { UsersDrizzleRepository } from '@/repositories/drizzle/users.drizzle.repository'

import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const usersRepository = new UsersDrizzleRepository()
  const authenticateUseCase = new AuthenticateUseCase(usersRepository)

  return authenticateUseCase
}
