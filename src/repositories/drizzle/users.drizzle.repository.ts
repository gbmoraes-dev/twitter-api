import { eq, ilike, or } from 'drizzle-orm'

import { db } from '@/db'

import {
  type UserInsert,
  type User,
  users,
  type PublicUser,
} from '@/db/schemas'

import type { UsersRepository } from '../users.repository'

export class UsersDrizzleRepository implements UsersRepository {
  async create(data: UserInsert): Promise<User> {
    const [user] = await db.insert(users).values(data).returning()

    return user
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id))

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email))

    return user
  }

  async findByUsername(username: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))

    return user
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, token))

    return user
  }

  async search(query: string, page: number): Promise<PublicUser[]> {
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        bio: users.bio,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(
        or(
          ilike(users.username, `%${query}%`),
          ilike(users.firstName, `%${query}%`),
          ilike(users.lastName, `%${query}%`),
        ),
      )
      .limit(20)
      .offset((page - 1) * 20)

    return result
  }

  async update(id: string, data: Partial<UserInsert>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning()

    return user
  }

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id)).returning()
  }
}
