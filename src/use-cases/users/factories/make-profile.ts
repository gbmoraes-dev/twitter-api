import { UsersDrizzleRepository } from '@/repositories/drizzle/users.drizzle.repository'

import { UserProfileUseCase } from '../profile'

export function makeUserProfileUseCase() {
  const usersRepository = new UsersDrizzleRepository()
  const userProfileUseCase = new UserProfileUseCase(usersRepository)

  return userProfileUseCase
}
