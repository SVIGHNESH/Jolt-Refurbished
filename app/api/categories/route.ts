import { NextResponse } from 'next/server';
import { categoriesRepo } from '@/lib/db/repos/categories';
import { resolveUser } from '@/lib/api-helpers';
import { checkLimit } from '@/lib/ratelimit';

export async function GET() {
  const { userId, response } = await resolveUser();
  if (response) return response;
  try {
    const data = await categoriesRepo.list(userId);
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId, response } = await resolveUser();
  if (response) return response;
  const limited = await checkLimit('writes', userId);
  if (limited) return limited;
  try {
    const { name, color } = await request.json();
    const cat = await categoriesRepo.create(userId, name, color ?? '#FF3D7F');
    return NextResponse.json(cat, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
