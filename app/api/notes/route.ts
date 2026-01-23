import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  try {
    if (query) {
      const notes = DatabaseService.searchNotes(query);
      return NextResponse.json(notes);
    } else {
      const notes = DatabaseService.getAllNotes();
      return NextResponse.json(notes);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const note = DatabaseService.createNote(body);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
