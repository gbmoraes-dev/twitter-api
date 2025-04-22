import { expect, describe, it, beforeEach } from 'vitest'

import { UsersInMemoryRepository } from '@/repositories/in-memory/users.in-memory.repository'

import { UserProfileUseCase } from './profile'

import { ResourceNotFoundError } from '../errors/resource-not-found'

let usersRepository: UsersInMemoryRepository
let sut: UserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository()
    sut = new UserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      passwordHash: '123456',
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.firstName).toEqual('John')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
