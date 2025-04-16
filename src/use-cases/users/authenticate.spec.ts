import * as bcryptjs from 'bcryptjs'

import { expect, describe, it, beforeEach } from 'vitest'

import { UsersInMemoryRepository } from '@/repositories/in-memory/users.in-memory.repository'

import { AuthenticateUseCase } from './authenticate'

import { InvalidCredentialsError } from '../errors/invalid-credentials'

import { AccountNotVerifiedError } from '../errors/account-not-verified'

let usersRepository: UsersInMemoryRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const user = await usersRepository.create({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      passwordHash: await bcryptjs.hash('123456', 6),
    })

    await usersRepository.update(user.id, {
      emailIsVerified: true,
      emailVerificationToken: null,
    })

    const { user: verifiedUser } = await sut.execute({
      username: 'johndoe',
      password: '123456',
    })

    expect(verifiedUser.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong username', async () => {
    await expect(() =>
      sut.execute({
        username: 'johndoe',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const user = await usersRepository.create({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      passwordHash: await bcryptjs.hash('123456', 6),
    })

    await usersRepository.update(user.id, {
      emailIsVerified: true,
      emailVerificationToken: null,
    })

    await expect(() =>
      sut.execute({
        username: 'johndoe',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with an account was not verified', async () => {
    await usersRepository.create({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      passwordHash: await bcryptjs.hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        username: 'johndoe',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AccountNotVerifiedError)
  })
})
