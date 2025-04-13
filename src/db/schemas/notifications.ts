import { index, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

import { createId } from '@paralleldrive/cuid2'

import { users } from './users'

import { likes } from './likes'

import { comments } from './comments'

import { follows } from './follows'

export const notificationType = pgEnum('notification_type', [
  'like',
  'comment',
  'follow',
])

export const notifications = pgTable(
  'notifications',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text('user_id')
      .references(() => users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    actorId: text('actor_id')
      .references(() => users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    referenceId: text('reference_id').notNull(),
    type: notificationType('type').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    readAt: timestamp('read_at'),
  },
  (table) => [
    index('notifications_user_id_idx').on(table.userId),
    index('notifications_actor_id_idx').on(table.actorId),
    index('notifications_user_id_read_at_idx').on(table.userId, table.readAt),
    index('notifications_reference_id_idx').on(table.referenceId),
    index('notifications_type_idx').on(table.type),
    index('notifications_created_at_idx').on(table.createdAt),
  ],
)

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
    relationName: 'receiver',
  }),
  actor: one(users, {
    fields: [notifications.actorId],
    references: [users.id],
    relationName: 'actor',
  }),
  like: one(likes, {
    fields: [notifications.referenceId],
    references: [likes.id],
  }),
  comment: one(comments, {
    fields: [notifications.referenceId],
    references: [comments.id],
  }),
  follow: one(follows, {
    fields: [notifications.referenceId],
    references: [follows.id],
  }),
}))

export type Notification = typeof notifications.$inferSelect

export type NotificationInsert = typeof notifications.$inferInsert
