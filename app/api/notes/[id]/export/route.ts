import { NextResponse } from 'next/server';
import { resolveUser } from '@/lib/api-helpers';
import { notesRepo } from '@/lib/db/repos/notes';
import { noteToMarkdown, singleNoteFilename } from '@/lib/export';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { userId, response } = await resolveUser();
  if (response) return response;

  const note = await notesRepo.get(userId, params.id);
  if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const md = noteToMarkdown(note);
  return new NextResponse(md, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${singleNoteFilename(note)}"`,
      'Cache-Control': 'no-store',
    },
  });
}
