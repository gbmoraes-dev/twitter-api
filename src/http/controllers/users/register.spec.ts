import request from 'supertest'

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import { sql } from 'drizzle-orm'

import { app } from '@/app'

import { db } from '@/db'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await db.execute(sql`BEGIN`)
  })

  afterEach(async () => {
    await db.execute(sql`ROLLBACK`)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a new user', async () => {
    const response = await request(app.server).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should not be able to register a user with an username that is already in use', async () => {
    await request(app.server).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'john@test.com',
      password: '123456',
    })

    const response = await request(app.server).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'doe@test.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(409)
    expect(response.body).toEqual({
      message: 'This username is already in use.',
    })
  })

  it('should not be able to register a user with an email that is already in use', async () => {
    await request(app.server).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'john',
      email: 'johndoe@test.com',
      password: '123456',
    })

    const response = await request(app.server).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'doe',
      email: 'johndoe@test.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(409)
    expect(response.body).toEqual({
      message: 'This email is already in use.',
    })
  })
})
