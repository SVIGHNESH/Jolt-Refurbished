import { NextResponse } from 'next/server';
import { tagsRepo } from '@/lib/db/repos/tags';
import { resolveUser } from '@/lib/api-helpers';

export async function GET() {
  const { userId, response } = await resolveUser();
  if (response) return response;
  try {
    const data = await tagsRepo.list(userId);
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}
