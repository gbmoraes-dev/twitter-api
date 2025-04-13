import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

import { createId } from '@paralleldrive/cuid2'

import { users } from './users'

import { comments } from './comments'

import { likes } from './likes'

export const posts = pgTable(
  'posts',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text('user_id')
      .references(() => users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('posts_user_id_idx').on(table.userId),
    index('posts_created_at_idx').on(table.createdAt),
    index('posts_user_created_at_idx').on(table.userId, table.createdAt),
    index('posts_feed_idx').on(table.createdAt, table.userId),
  ],
)

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
}))

export type Post = typeof posts.$inferSelect

export type PostInsert = typeof posts.$inferInsert
