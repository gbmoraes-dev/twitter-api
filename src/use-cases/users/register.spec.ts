import * as bcryptjs from 'bcryptjs'

import { beforeEach, describe, expect, it } from 'vitest'

import { UsersInMemoryRepository } from '@/repositories/in-memory/users.in-memory.repository'

import { RegisterUseCase } from './register'

import { UsernameAlreadyExistsError } from '../errors/username-already-exists'

import { EmailAlreadyExistsError } from '../errors/email-already-exists'

let userRepository: UsersInMemoryRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new UsersInMemoryRepository()
    sut = new RegisterUseCase(userRepository)
  })

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash a user password', async () => {
    const { user } = await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await bcryptjs.compare(
      '123456',
      user.passwordHash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register a user with an username that is already in use', async () => {
    const username = 'johndoe'

    await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username,
      email: 'johndoe@test.com',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        username: 'johndoe',
        email: 'johndoe@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UsernameAlreadyExistsError)
  })

  it('should not be able to register a user with an email that is already in use', async () => {
    const email = 'johndoe@test.com'

    await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        username: 'doejohn',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })
})
