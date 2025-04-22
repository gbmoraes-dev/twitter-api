import type { FastifyInstance } from 'fastify'

import request from 'supertest'

import { hash } from 'bcryptjs'

import { eq } from 'drizzle-orm'

import { db } from '@/db'

import { users } from '@/db/schemas'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const [user] = await db
    .insert(users)
    .values({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
    })
    .returning()

  await db
    .update(users)
    .set({
      emailIsVerified: true,
      emailVerificationToken: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))

  const response = await request(app.server).post('/authenticate').send({
    username: 'johndoe',
    password: '123456',
  })

  const { token } = response.body

  return { token }
}
