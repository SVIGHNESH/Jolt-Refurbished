import { and, desc, eq, ilike, or, inArray } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { notes, tags, noteTags } from '@/lib/db/schema';
import type { Note } from '@/types';

/* Tag upsert (per-user, by name) → returns ids */
async function upsertTags(userId: string, names: string[]): Promise<string[]> {
  const cleaned = Array.from(new Set(names.map((n) => n.trim()).filter(Boolean)));
  if (cleaned.length === 0) return [];

  const ids: string[] = [];
  for (const name of cleaned) {
    const existing = await db
      .select({ id: tags.id })
      .from(tags)
      .where(and(eq(tags.userId, userId), eq(tags.name, name)))
      .limit(1);

    if (existing[0]) {
      ids.push(existing[0].id);
    } else {
      const [row] = await db
        .insert(tags)
        .values({ userId, name })
        .returning({ id: tags.id });
      ids.push(row.id);
    }
  }
  return ids;
}

async function tagsForNotes(noteIds: string[]): Promise<Map<string, string[]>> {
  const out = new Map<string, string[]>();
  if (noteIds.length === 0) return out;

  const rows = await db
    .select({ noteId: noteTags.noteId, name: tags.name })
    .from(noteTags)
    .innerJoin(tags, eq(noteTags.tagId, tags.id))
    .where(inArray(noteTags.noteId, noteIds));

  for (const r of rows) {
    const arr = out.get(r.noteId) ?? [];
    arr.push(r.name);
    out.set(r.noteId, arr);
  }
  return out;
}

function rowToNote(r: typeof notes.$inferSelect, t: string[] = []): Note {
  return {
    id: r.id,
    title: r.title,
    content: r.content,
    isPinned: r.isPinned,
    isFavorite: r.isFavorite,
    categoryId: r.categoryId ?? undefined,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    tags: t,
  };
}

export const notesRepo = {
  async list(userId: string, query?: string): Promise<Note[]> {
    const where = query?.trim()
      ? and(
          eq(notes.userId, userId),
          or(ilike(notes.title, `%${query}%`), ilike(notes.content, `%${query}%`)),
        )
      : eq(notes.userId, userId);

    const rows = await db
      .select()
      .from(notes)
      .where(where)
      .orderBy(desc(notes.isPinned), desc(notes.updatedAt));

    const tagMap = await tagsForNotes(rows.map((r) => r.id));
    return rows.map((r) => rowToNote(r, tagMap.get(r.id) ?? []));
  },

  async get(userId: string, id: string): Promise<Note | null> {
    const [row] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.userId, userId), eq(notes.id, id)))
      .limit(1);
    if (!row) return null;
    const tagMap = await tagsForNotes([row.id]);
    return rowToNote(row, tagMap.get(row.id) ?? []);
  },

  async create(
    userId: string,
    data: { title?: string; content?: string; isPinned?: boolean; isFavorite?: boolean; tags?: string[] },
  ): Promise<Note> {
    const [row] = await db
      .insert(notes)
      .values({
        userId,
        title: data.title ?? '',
        content: data.content ?? '',
        isPinned: data.isPinned ?? false,
        isFavorite: data.isFavorite ?? false,
      })
      .returning();

    if (data.tags && data.tags.length > 0) {
      const tagIds = await upsertTags(userId, data.tags);
      await db.insert(noteTags).values(tagIds.map((tagId) => ({ noteId: row.id, tagId })));
    }

    return rowToNote(row, data.tags ?? []);
  },

  async update(
    userId: string,
    id: string,
    updates: { title?: string; content?: string; isPinned?: boolean; isFavorite?: boolean; tags?: string[] },
  ): Promise<Note | null> {
    const set: Record<string, unknown> = { updatedAt: new Date() };
    if (updates.title !== undefined)      set.title      = updates.title;
    if (updates.content !== undefined)    set.content    = updates.content;
    if (updates.isPinned !== undefined)   set.isPinned   = updates.isPinned;
    if (updates.isFavorite !== undefined) set.isFavorite = updates.isFavorite;

    const [row] = await db
      .update(notes)
      .set(set)
      .where(and(eq(notes.userId, userId), eq(notes.id, id)))
      .returning();
    if (!row) return null;

    if (updates.tags !== undefined) {
      await db.delete(noteTags).where(eq(noteTags.noteId, id));
      if (updates.tags.length > 0) {
        const tagIds = await upsertTags(userId, updates.tags);
        await db.insert(noteTags).values(tagIds.map((tagId) => ({ noteId: id, tagId })));
      }
    }

    const tagMap = await tagsForNotes([id]);
    return rowToNote(row, tagMap.get(id) ?? []);
  },

  async remove(userId: string, id: string): Promise<boolean> {
    const res = await db
      .delete(notes)
      .where(and(eq(notes.userId, userId), eq(notes.id, id)))
      .returning({ id: notes.id });
    return res.length > 0;
  },
};
