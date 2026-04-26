import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { resolveUser } from '@/lib/api-helpers';
import { signOut } from '@/auth';

export async function DELETE(request: Request) {
  const { userId, response } = await resolveUser();
  if (response) return response;

  let body: { confirm?: string } = {};
  try { body = await request.json(); } catch {}
  if (body.confirm !== 'DELETE my account') {
    return NextResponse.json(
      { error: "Confirmation phrase doesn't match." },
      { status: 400 },
    );
  }

  // Cascade wipes notes, tags, categories, note_tags, accounts, sessions.
  await db.delete(users).where(eq(users.id, userId));

  // Clear the session cookie. signOut throws a redirect; we just want
  // the cookie cleared without redirecting from a JSON endpoint.
  try { await signOut({ redirect: false }); } catch {}

  return NextResponse.json({ success: true });
}
