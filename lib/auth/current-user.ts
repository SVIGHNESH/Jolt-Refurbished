import { auth } from '@/auth';

/**
 * Returns the current user id from the Auth.js session, or null if not signed in.
 * API routes should treat null as 401.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function requireUserId(): Promise<string> {
  const id = await getCurrentUserId();
  if (!id) throw new UnauthorizedError();
  return id;
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}
