import type { PublicUser, User, UserInsert } from '@/db/schemas'

export interface UsersRepository {
  create(data: UserInsert): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  findByVerificationToken(token: string): Promise<User | null>
  search(query: string, page: number): Promise<PublicUser[]>
  update(id: string, data: Partial<UserInsert>): Promise<User>
  delete(id: string): Promise<void>
}
