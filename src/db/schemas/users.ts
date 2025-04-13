import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

import { type InferSelectModel, relations } from 'drizzle-orm'

import { createId } from '@paralleldrive/cuid2'

import { posts } from './posts'

import { comments } from './comments'

import { likes } from './likes'

import { follows } from './follows'

import { notifications } from './notifications'

export const users = pgTable(
  'users',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name'),
    bio: text('bio'),
    username: text('username').unique().notNull(),
    email: text('email').unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    emailIsVerified: boolean('email_is_verified').default(false).notNull(),
    emailVerificationToken: text('email_verification_token').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('users_username_idx').on(table.username),
    uniqueIndex('users_email_idx').on(table.email),
    index('users_email_verification_token_idx').on(
      table.emailVerificationToken,
    ),
    index('users_name_idx').on(table.firstName, table.lastName),
  ],
)

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  followers: many(follows, { relationName: 'follower' }),
  following: many(follows, { relationName: 'following' }),
  receiver: many(notifications, { relationName: 'receiver' }),
  actor: many(notifications, { relationName: 'actor' }),
}))

export type User = typeof users.$inferSelect

export type UserInsert = typeof users.$inferInsert

export type PublicUser = Pick<
  InferSelectModel<typeof users>,
  'id' | 'username' | 'firstName' | 'lastName' | 'bio' | 'createdAt'
>
