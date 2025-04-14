import { UsersDrizzleRepository } from '@/repositories/drizzle/users.drizzle.repository'

import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const usersRepository = new UsersDrizzleRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  return registerUseCase
}
