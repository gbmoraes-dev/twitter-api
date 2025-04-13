import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

import { createId } from '@paralleldrive/cuid2'

import { users } from './users'

import { posts } from './posts'

import { comments } from './comments'

export const likeableType = pgEnum('likeable_type', ['post', 'comment'])

export const likes = pgTable(
  'likes',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    likeableId: text('likeable_id').notNull(),
    type: likeableType('likeable_type').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('user_likeable_idx').on(
      table.userId,
      table.likeableId,
      table.type,
    ),
    index('likes_likeable_idx').on(table.likeableId, table.type),
    index('likes_user_id_idx').on(table.userId),
    index('likes_type_idx').on(table.type),
    index('likes_user_type_created_at_idx').on(
      table.userId,
      table.type,
      table.createdAt,
    ),
  ],
)

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.likeableId],
    references: [posts.id],
  }),
  comments: one(comments, {
    fields: [likes.likeableId],
    references: [comments.id],
  }),
}))

export type Like = typeof likes.$inferSelect

export type LikeInsert = typeof likes.$inferInsert
