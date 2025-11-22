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

    // Read current glossary file
    const glossaryPath = path.join(process.cwd(), 'src', 'lib', 'glossary.ts');
    let fileContent = fs.readFileSync(glossaryPath, 'utf-8');
    
    // Find the glossaryTerms array
    const termsArrayMatch = fileContent.match(/export const glossaryTerms: GlossaryTerm\[\] = \[([\s\S]*?)\];/);
    if (!termsArrayMatch) {
      return NextResponse.json({ error: 'Could not parse glossary file' }, { status: 500 });
    }

    // Format the new term as a string
    const termString = `{
    slug: '${newTerm.slug}',
    language: '${newTerm.language}',
    term: '${newTerm.term.replace(/'/g, "\\'")}',
    category: '${newTerm.category}',${newTerm.pronunciation ? `\n    pronunciation: '${newTerm.pronunciation.replace(/'/g, "\\'")}',` : ''}
    definition: \`${newTerm.definition.replace(/`/g, '\\`')}\`,
    explanation: \`${newTerm.explanation.replace(/`/g, '\\`')}\`,${newTerm.examples && newTerm.examples.length > 0 ? `\n    examples: [\n${newTerm.examples.map((ex: string) => `      '${ex.replace(/'/g, "\\'").replace(/\n/g, ' ')}'`).join(',\n')}\n    ],` : ''}${newTerm.relatedTerms && newTerm.relatedTerms.length > 0 ? `\n    relatedTerms: [${newTerm.relatedTerms.map((rt: string) => `'${rt}'`).join(', ')}],` : ''}${newTerm.etymology ? `\n    etymology: '${newTerm.etymology.replace(/'/g, "\\'")}',` : ''}
  }`;

    // Insert the new term at the end of the array
    const updatedArray = termsArrayMatch[1].trim() + (termsArrayMatch[1].trim() ? ',\n\n  ' : '  ') + termString;
    const updatedContent = fileContent.replace(
      termsArrayMatch[0],
      `export const glossaryTerms: GlossaryTerm[] = [\n  ${updatedArray}\n];`
    );

    // Write back to file
    fs.writeFileSync(glossaryPath, updatedContent, 'utf-8');

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

    // Read current glossary file
    const glossaryPath = path.join(process.cwd(), 'src', 'lib', 'glossary.ts');
    let fileContent = fs.readFileSync(glossaryPath, 'utf-8');
    
    // Escape special regex characters in slug
    const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Parse the file to find the term more safely
    const termsArrayMatch = fileContent.match(/export const glossaryTerms: GlossaryTerm\[\] = \[([\s\S]*)\];/);
    if (!termsArrayMatch) {
      return NextResponse.json({ error: 'Could not parse glossary file' }, { status: 500 });
    }
    
    const termsContent = termsArrayMatch[1];
    
    // More precise regex: match complete term object with proper boundaries
    // Start with { followed by any content until we find our slug, then match until the closing }
    // but stop before the next opening brace of another term
    const termRegex = new RegExp(
      `\\{[\\s\\S]*?slug:\\s*'${escapedSlug}'[\\s\\S]*?\\}(?=\\s*,?\\s*(?:\\{|\\]))`,
      'g'
    );
    
    if (!termRegex.test(termsContent)) {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 });
    }

    // Remove the term from the terms array content
    const updatedTermsContent = termsContent.replace(termRegex, '').trim();
    
    // Clean up double commas and formatting
    const cleanedContent = updatedTermsContent
      .replace(/,(\s*),/g, ',')
      .replace(/,(\s*)\]/g, '')
      .replace(/\[\s*,/g, '')
      .replace(/\n\n\n+/g, '\n\n')
      .trim();
    
    // Rebuild the file
    fileContent = fileContent.replace(
      termsArrayMatch[0],
      `export const glossaryTerms: GlossaryTerm[] = [\n  ${cleanedContent}\n];`
    );
    
    // Write back to file
    fs.writeFileSync(glossaryPath, fileContent, 'utf-8');

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
