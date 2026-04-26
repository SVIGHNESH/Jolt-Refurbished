import { NextResponse } from 'next/server';
import { notesRepo } from '@/lib/db/repos/notes';
import { resolveUser } from '@/lib/api-helpers';
import { checkLimit } from '@/lib/ratelimit';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { userId, response } = await resolveUser();
  if (response) return response;
  try {
    const note = await notesRepo.get(userId, params.id);
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    return NextResponse.json(note);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId, response } = await resolveUser();
  if (response) return response;
  const limited = await checkLimit('writes', userId);
  if (limited) return limited;
  try {
    const body = await req.json();
    const note = await notesRepo.update(userId, params.id, body);
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    return NextResponse.json(note);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { userId, response } = await resolveUser();
  if (response) return response;
  const limited = await checkLimit('writes', userId);
  if (limited) return limited;
  try {
    const ok = await notesRepo.remove(userId, params.id);
    if (!ok) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
