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

describe('Verify Account (e2e)', () => {
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

  it('should be able to verify an account', async () => {
    await request(app.server).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      password: '123456',
    })

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.username, 'johndoe')
      },
    })

    const response = await request(app.server).patch('/verify-account').send({
      token: user?.emailVerificationToken,
    })

    expect(response.statusCode).toEqual(200)
  })

  it('should not be able to verify an account with invalid token', async () => {
    const response = await request(app.server).patch('/verify-account').send({
      token: 'non-existing-token',
    })

    expect(response.statusCode).toEqual(409)
    expect(response.body).toEqual({
      message: 'Invalid token provided or account is already verified.',
    })
  })
})
