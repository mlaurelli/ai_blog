import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllTermsAdmin } from '@/lib/glossary';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Return ALL terms (both EN and IT) for admin or API use
  const terms = getAllTermsAdmin();
  return NextResponse.json(terms);
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newTerm = await request.json();
    
    // Validate required fields
    if (!newTerm.slug || !newTerm.language || !newTerm.term || !newTerm.category || !newTerm.definition || !newTerm.explanation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Read current glossary from JSON
    const glossaryPath = path.join(process.cwd(), 'data', 'glossary.json');
    let terms = [];
    
    try {
      const fileContent = fs.readFileSync(glossaryPath, 'utf-8');
      terms = JSON.parse(fileContent);
    } catch (e) {
      console.error('Error reading glossary.json:', e);
      terms = [];
    }

    // Add the new term
    terms.push(newTerm);

    // Write back to JSON file
    fs.writeFileSync(glossaryPath, JSON.stringify(terms, null, 2), 'utf-8');

    // Revalidate glossary pages
    revalidatePath('/glossary', 'page');
    revalidatePath('/admin/glossary', 'page');
    revalidatePath('/glossary/[slug]', 'page');
    revalidatePath(`/glossary/${newTerm.slug}`, 'page');

    return NextResponse.json({ success: true, term: newTerm });
  } catch (error) {
    console.error('Error creating term:', error);
    return NextResponse.json({ error: 'Failed to create term' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await request.json();
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Read current glossary from JSON
    const glossaryPath = path.join(process.cwd(), 'data', 'glossary.json');
    let terms = [];
    
    try {
      const fileContent = fs.readFileSync(glossaryPath, 'utf-8');
      terms = JSON.parse(fileContent);
    } catch (e) {
      return NextResponse.json({ error: 'Error reading glossary' }, { status: 500 });
    }

    // Find and remove the term
    const termIndex = terms.findIndex((t: any) => t.slug === slug);
    
    if (termIndex === -1) {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 });
    }

    terms.splice(termIndex, 1);
    
    // Write back to JSON file
    fs.writeFileSync(glossaryPath, JSON.stringify(terms, null, 2), 'utf-8');

    // Revalidate glossary pages
    revalidatePath('/glossary', 'page');
    revalidatePath('/admin/glossary', 'page');
    revalidatePath('/glossary/[slug]', 'page');
    revalidatePath(`/glossary/${slug}`, 'page');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting term:', error);
    return NextResponse.json({ error: 'Failed to delete term' }, { status: 500 });
  }
}
