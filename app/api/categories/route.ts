import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db';

export async function GET() {
  try {
    const categories = DatabaseService.getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, color } = await request.json();
    const category = DatabaseService.createCategory(name, color);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
