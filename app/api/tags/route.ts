import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db';

export async function GET() {
  try {
    const tags = DatabaseService.getAllTags();
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}
