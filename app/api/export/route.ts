import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { notesRepo } from '@/lib/db/repos/notes';
import { buildZip } from '@/lib/export';
import { checkLimit } from '@/lib/ratelimit';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limited = await checkLimit('export', session.user.id);
  if (limited) return limited;

  try {
    const notes = await notesRepo.list(session.user.id);
    const zip = await buildZip(notes, session.user.email ?? 'unknown');
    const stamp = new Date().toISOString().slice(0, 10);

    return new NextResponse(zip as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="jolt-notes-${stamp}.zip"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
