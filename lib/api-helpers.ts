import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth/current-user';

/** Resolve a userId or return a 401 NextResponse. */
export async function resolveUser(): Promise<
  { userId: string; response?: undefined } | { userId?: undefined; response: NextResponse }
> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { userId };
}
