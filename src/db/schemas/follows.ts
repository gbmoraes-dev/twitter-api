import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

import { createId } from '@paralleldrive/cuid2'

import { users } from './users'

export const follows = pgTable(
  'follows',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    followerId: text('follower_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    followingId: text('following_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('follower_following_idx').on(
      table.followerId,
      table.followingId,
    ),
    index('follows_follower_id_idx').on(table.followerId),
    index('follows_following_id_idx').on(table.followingId),
    index('follows_created_at_idx').on(table.createdAt),
    index('follows_following_created_at_idx').on(
      table.followingId,
      table.createdAt,
    ),
  ],
)

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: 'follower',
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: 'following',
  }),
}))

export type Follow = typeof follows.$inferSelect

export type FollowInsert = typeof follows.$inferInsert
