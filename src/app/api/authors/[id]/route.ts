import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import { getAuthorById } from '@/lib/authors';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const author = getAuthorById(id);
  if (!author) {
    return NextResponse.json({ error: 'Author not found' }, { status: 404 });
  }
  return NextResponse.json(author);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updatedAuthor = await request.json();
    
    // Read current authors from JSON
    const authorsPath = path.join(process.cwd(), 'data', 'authors.json');
    let authors = [];
    
    try {
      const fileContent = fs.readFileSync(authorsPath, 'utf-8');
      authors = JSON.parse(fileContent);
    } catch (e) {
      return NextResponse.json({ error: 'Error reading authors' }, { status: 500 });
    }

    // Find and update the author
    const authorIndex = authors.findIndex((a: any) => a.id === id);
    
    if (authorIndex === -1) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    authors[authorIndex] = updatedAuthor;
    
    // Write back to JSON file
    fs.writeFileSync(authorsPath, JSON.stringify(authors, null, 2), 'utf-8');
      
    // Revalidate paths - INCLUDING blog pages that show author
    try {
      revalidatePath('/admin/authors', 'layout');
      revalidatePath(`/author/${id}`, 'page');
      revalidatePath('/blog', 'layout');
      revalidatePath('/', 'layout');
    } catch (error) {
      // Silent fail for cache revalidation
    }
      
    return NextResponse.json({ success: true, message: 'Author updated successfully' });
  } catch (error) {
    console.error('Error updating author:', error);
    return NextResponse.json({ error: 'Failed to update author' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Read current authors from JSON
    const authorsPath = path.join(process.cwd(), 'data', 'authors.json');
    let authors = [];
    
    try {
      const fileContent = fs.readFileSync(authorsPath, 'utf-8');
      authors = JSON.parse(fileContent);
    } catch (e) {
      return NextResponse.json({ error: 'Error reading authors' }, { status: 500 });
    }

    // Find and remove the author
    const authorIndex = authors.findIndex((a: any) => a.id === id);
    
    if (authorIndex === -1) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    authors.splice(authorIndex, 1);
    
    // Write back to JSON file
    fs.writeFileSync(authorsPath, JSON.stringify(authors, null, 2), 'utf-8');
    
    revalidatePath('/authors', 'layout');
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json({ error: 'Failed to delete author' }, { status: 500 });
  }
}
