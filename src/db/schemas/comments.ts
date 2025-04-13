import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

import { createId } from '@paralleldrive/cuid2'

import { users } from './users'

import { posts } from './posts'

import { likes } from './likes'

export const comments = pgTable(
  'comments',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text('user_id')
      .references(() => users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    postId: text('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('comments_user_id_idx').on(table.userId),
    index('comments_post_id_idx').on(table.postId),
    index('comments_created_at_idx').on(table.createdAt),
    index('comments_user_id_created_at_idx').on(table.userId, table.createdAt),
    index('comments_post_id_created_at_idx').on(table.postId, table.createdAt),
  ],
)

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  likes: many(likes),
}))

export type Comment = typeof comments.$inferSelect

export type CommentInsert = typeof comments.$inferInsert
