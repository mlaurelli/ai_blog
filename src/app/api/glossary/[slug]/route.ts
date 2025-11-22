import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getTermBySlug } from '@/lib/glossary';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get('lang') || 'en') as 'en' | 'it';
  
  const term = getTermBySlug(slug, lang);
  
  if (!term) {
    return NextResponse.json(
      { error: 'Term not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(term);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'it';
    const updatedTerm = await request.json();

    // Read current glossary from JSON
    const glossaryPath = path.join(process.cwd(), 'data', 'glossary.json');
    let terms = [];
    
    try {
      const fileContent = fs.readFileSync(glossaryPath, 'utf-8');
      terms = JSON.parse(fileContent);
    } catch (e) {
      return NextResponse.json({ error: 'Error reading glossary' }, { status: 500 });
    }

    // Find and update the term
    const termIndex = terms.findIndex((t: any) => t.slug === slug && t.language === lang);
    
    if (termIndex === -1) {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 });
    }

    terms[termIndex] = updatedTerm;
    
    // Write back to JSON file
    fs.writeFileSync(glossaryPath, JSON.stringify(terms, null, 2), 'utf-8');

    // Revalidate glossary pages
    revalidatePath('/glossary', 'page');
    revalidatePath('/admin/glossary', 'page');
    revalidatePath('/glossary/[slug]', 'page');
    revalidatePath(`/glossary/${slug}`, 'page');
    if (slug !== updatedTerm.slug) {
      revalidatePath(`/glossary/${updatedTerm.slug}`, 'page');
    }

    return NextResponse.json({ success: true, term: updatedTerm });
  } catch (error) {
    console.error('Error updating term:', error);
    return NextResponse.json({ error: 'Failed to update term' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'it';

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
    const termIndex = terms.findIndex((t: any) => t.slug === slug && t.language === lang);
    
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
