import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { categories } from '@/lib/db/schema';
import type { Category } from '@/types';

function row(r: typeof categories.$inferSelect): Category {
  return { id: r.id, name: r.name, color: r.color, createdAt: r.createdAt.toISOString() };
}

export const categoriesRepo = {
  async list(userId: string): Promise<Category[]> {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(asc(categories.name));
    return rows.map(row);
  },

  async create(userId: string, name: string, color: string): Promise<Category> {
    const [r] = await db.insert(categories).values({ userId, name, color }).returning();
    return row(r);
  },

  async remove(userId: string, id: string): Promise<boolean> {
    const res = await db
      .delete(categories)
      .where(and(eq(categories.userId, userId), eq(categories.id, id)))
      .returning({ id: categories.id });
    return res.length > 0;
  },
};
