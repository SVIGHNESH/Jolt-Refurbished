import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { tags } from '@/lib/db/schema';
import type { Tag } from '@/types';

function row(r: typeof tags.$inferSelect): Tag {
  return { id: r.id, name: r.name, createdAt: r.createdAt.toISOString() };
}

export const tagsRepo = {
  async list(userId: string): Promise<Tag[]> {
    const rows = await db
      .select()
      .from(tags)
      .where(eq(tags.userId, userId))
      .orderBy(asc(tags.name));
    return rows.map(row);
  },
};
