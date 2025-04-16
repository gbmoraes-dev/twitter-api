import { beforeEach, describe, expect, it } from 'vitest'

import { UsersInMemoryRepository } from '@/repositories/in-memory/users.in-memory.repository'

import { VerifyAccountUseCase } from './verify-account'

import { InvalidTokenError } from '../errors/invalid-token'

let userRepository: UsersInMemoryRepository
let sut: VerifyAccountUseCase

describe('Verify Account Use Case', () => {
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

    const { user: verifiedUser } = await sut.execute({
      token: user.emailVerificationToken ?? '',
    })

    expect(verifiedUser.emailIsVerified).toBe(true)
    expect(verifiedUser.emailVerificationToken).toBe(null)
  })

  it('should not be able to verify an account with an invalid token', async () => {
    await expect(() =>
      sut.execute({
        token: 'non-existing-token',
      }),
    ).rejects.toBeInstanceOf(InvalidTokenError)
  })
})
