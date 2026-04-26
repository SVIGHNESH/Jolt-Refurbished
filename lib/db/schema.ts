import {
  pgTable, text, timestamp, boolean, integer, primaryKey, uniqueIndex, index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/* ── Auth.js managed tables ─────────────────────────────── */

export const users = pgTable('users', {
  id:            text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:          text('name'),
  email:         text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image:         text('image'),
  createdAt:     timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export const accounts = pgTable(
  'accounts',
  {
    userId:            text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type:              text('type').notNull(),
    provider:          text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token:     text('refresh_token'),
    access_token:      text('access_token'),
    expires_at:        integer('expires_at'),
    token_type:        text('token_type'),
    scope:             text('scope'),
    id_token:          text('id_token'),
    session_state:     text('session_state'),
  },
  (t) => ({ pk: primaryKey({ columns: [t.provider, t.providerAccountId] }) }),
);

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId:       text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires:      timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token:      text('token').notNull(),
    expires:    timestamp('expires', { mode: 'date' }).notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.identifier, t.token] }) }),
);

/* ── App tables ─────────────────────────────────────────── */

export const categories = pgTable(
  'categories',
  {
    id:        text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name:      text('name').notNull(),
    color:     text('color').notNull().default('#FF3D7F'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('categories_user_idx').on(t.userId),
    userNameUq: uniqueIndex('categories_user_name_uq').on(t.userId, t.name),
  }),
);

export const tags = pgTable(
  'tags',
  {
    id:        text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name:      text('name').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('tags_user_idx').on(t.userId),
    userNameUq: uniqueIndex('tags_user_name_uq').on(t.userId, t.name),
  }),
);

export const notes = pgTable(
  'notes',
  {
    id:         text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId:     text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title:      text('title').notNull().default(''),
    content:    text('content').notNull().default(''),
    isPinned:   boolean('is_pinned').notNull().default(false),
    isFavorite: boolean('is_favorite').notNull().default(false),
    categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
    createdAt:  timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt:  timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('notes_user_idx').on(t.userId),
    userUpdatedIdx: index('notes_user_updated_idx').on(t.userId, t.updatedAt),
  }),
);

export const noteTags = pgTable(
  'note_tags',
  {
    noteId: text('note_id').notNull().references(() => notes.id, { onDelete: 'cascade' }),
    tagId:  text('tag_id').notNull().references(() => tags.id,  { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.noteId, t.tagId] }),
    tagIdx: index('note_tags_tag_idx').on(t.tagId),
  }),
);

/* ── Relations ──────────────────────────────────────────── */

export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
  tags: many(tags),
  categories: many(categories),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  user: one(users, { fields: [notes.userId], references: [users.id] }),
  category: one(categories, { fields: [notes.categoryId], references: [categories.id] }),
  noteTags: many(noteTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  noteTags: many(noteTags),
}));

export const noteTagsRelations = relations(noteTags, ({ one }) => ({
  note: one(notes, { fields: [noteTags.noteId], references: [notes.id] }),
  tag:  one(tags,  { fields: [noteTags.tagId],  references: [tags.id]  }),
}));
