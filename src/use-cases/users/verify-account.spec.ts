import { beforeEach, describe, expect, it } from 'vitest'

import { VerifyAccountUseCase } from './verify-account'

import { UsersInMemoryRepository } from '@/repositories/in-memory/users.in-memory.repository'

import { ResourceNotFoundError } from '../errors/resource-not-found'

let userRepository: UsersInMemoryRepository
let sut: VerifyAccountUseCase

describe('Verify Account UseCase', () => {
  beforeEach(() => {
    userRepository = new UsersInMemoryRepository()
    sut = new VerifyAccountUseCase(userRepository)
  })

  it('should be able to verify an account', async () => {
    const user = await userRepository.create({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      passwordHash: '123456',
    })

    const verifiedUser = await sut.execute({
      token: user.emailVerificationToken ?? '',
    })

    expect(verifiedUser.verifiedUser.emailIsVerified).toBe(true)
    expect(verifiedUser.verifiedUser.emailVerificationToken).toBe(null)
  })

  it('should not be able to verify an account with an invalid token', async () => {
    await expect(() =>
      sut.execute({
        token: 'non-existing-token',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
