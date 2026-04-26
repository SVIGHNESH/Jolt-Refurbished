import { NextResponse } from 'next/server';
import { notesRepo } from '@/lib/db/repos/notes';
import { resolveUser } from '@/lib/api-helpers';
import { checkLimit } from '@/lib/ratelimit';

export async function GET(request: Request) {
  const { userId, response } = await resolveUser();
  if (response) return response;
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') ?? undefined;
    const data = await notesRepo.list(userId, query);
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId, response } = await resolveUser();
  if (response) return response;
  const limited = await checkLimit('writes', userId);
  if (limited) return limited;
  try {
    const body = await request.json();
    const note = await notesRepo.create(userId, body);
    return NextResponse.json(note, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
