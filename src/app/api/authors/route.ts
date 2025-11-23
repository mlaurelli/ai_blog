import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllAuthors } from '@/lib/authors';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const authors = getAllAuthors();
  return NextResponse.json(authors);
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newAuthor = await request.json();
    
    // Read current authors from JSON
    const authorsPath = path.join(process.cwd(), 'data', 'authors.json');
    let authors = [];
    
    try {
      const fileContent = fs.readFileSync(authorsPath, 'utf-8');
      authors = JSON.parse(fileContent);
    } catch (e) {
      console.error('Error reading authors.json:', e);
      authors = [];
    }

    // Add the new author
    authors.push(newAuthor);

    // Write back to JSON file
    fs.writeFileSync(authorsPath, JSON.stringify(authors, null, 2), 'utf-8');

    // Revalidate Next.js cache
    revalidatePath('/authors', 'layout');
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json({ error: 'Failed to create author' }, { status: 500 });
  }
}
