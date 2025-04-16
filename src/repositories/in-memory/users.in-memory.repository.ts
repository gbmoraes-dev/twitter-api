import type { UserInsert, User, PublicUser } from '@/db/schemas'

import type { UsersRepository } from '../users.repository'

export class UsersInMemoryRepository implements UsersRepository {
  private users: User[] = []

  async create(data: UserInsert): Promise<User> {
    const token = Math.floor(100000 + Math.random() * 900000).toString()

    const user = {
      id: 'a04jftqc19ejj5x8xdwvb68d',
      firstName: data.firstName,
      lastName: data.lastName ?? '',
      bio: data.bio ?? '',
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
      emailIsVerified: false,
      emailVerificationToken: token,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.push(user)

    return user
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find((user) => user.username === username) ?? null
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const user = this.users.find(
      (user) => user.emailVerificationToken === token,
    )

    if (user?.emailIsVerified) {
      return null
    }

    return user ?? null
  }

  async search(query: string, page: number): Promise<PublicUser[]> {
    const queryLower = query.toLowerCase()

    return this.users
      .filter((user) =>
        [user.username, user.firstName, user.lastName]
          .filter(Boolean)
          .some((field) => field?.toLowerCase().includes(queryLower)),
      )
      .slice((page - 1) * 20, page * 20)
      .map((user) => ({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        createdAt: user.createdAt,
      }))
  }

  async update(id: string, data: Partial<UserInsert>): Promise<User> {
    const index = this.users.findIndex((user) => user.id === id)

    const updatedUser: User = {
      ...this.users[index],
      ...data,
      updatedAt: new Date(),
    }

    this.users[index] = updatedUser

    return updatedUser
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id)

    this.users.splice(index, 1)
  }
}
