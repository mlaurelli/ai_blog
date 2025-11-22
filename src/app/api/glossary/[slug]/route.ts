import { NextResponse } from 'next/server';
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

    // Read current glossary file
    const glossaryPath = path.join(process.cwd(), 'src', 'lib', 'glossary.ts');
    let fileContent = fs.readFileSync(glossaryPath, 'utf-8');

    // Find the glossaryTerms array
    const termsArrayMatch = fileContent.match(/export const glossaryTerms: GlossaryTerm\[\] = \[([\s\S]*?)\];/);
    if (!termsArrayMatch) {
      return NextResponse.json({ error: 'Could not parse glossary file' }, { status: 500 });
    }

    // Parse the array to find and replace the specific term
    const arrayContent = termsArrayMatch[1];
    
    // Find the term to update using a regex that matches the entire term object
    const termRegex = new RegExp(
      `{[^}]*slug:\\s*'${slug}'[^}]*language:\\s*'${lang}'[^}]*}(?=,?\\s*(?:{|\\]))`,
      's'
    );

    if (!termRegex.test(arrayContent)) {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 });
    }

    // Format the updated term
    const termString = `{
    slug: '${updatedTerm.slug}',
    language: '${updatedTerm.language}',
    term: '${updatedTerm.term.replace(/'/g, "\\'")}',
    category: '${updatedTerm.category}',${updatedTerm.pronunciation ? `\n    pronunciation: '${updatedTerm.pronunciation.replace(/'/g, "\\'")}',` : ''}
    definition: \`${updatedTerm.definition.replace(/`/g, '\\`')}\`,
    explanation: \`${updatedTerm.explanation.replace(/`/g, '\\`')}\`,${updatedTerm.examples && updatedTerm.examples.length > 0 ? `\n    examples: [\n${updatedTerm.examples.map((ex: string) => `      '${ex.replace(/'/g, "\\'").replace(/\n/g, ' ')}'`).join(',\n')}\n    ],` : ''}${updatedTerm.relatedTerms && updatedTerm.relatedTerms.length > 0 ? `\n    relatedTerms: [${updatedTerm.relatedTerms.map((rt: string) => `'${rt}'`).join(', ')}],` : ''}${updatedTerm.etymology ? `\n    etymology: '${updatedTerm.etymology.replace(/'/g, "\\'")}',` : ''}
  }`;

    // Replace the old term with the updated one
    const updatedArray = arrayContent.replace(termRegex, termString);
    const updatedContent = fileContent.replace(
      termsArrayMatch[0],
      `export const glossaryTerms: GlossaryTerm[] = [${updatedArray}];`
    );

    // Write back to file
    fs.writeFileSync(glossaryPath, updatedContent, 'utf-8');

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

    // Read current glossary file
    const glossaryPath = path.join(process.cwd(), 'src', 'lib', 'glossary.ts');
    let fileContent = fs.readFileSync(glossaryPath, 'utf-8');

    // Find the glossaryTerms array
    const termsArrayMatch = fileContent.match(/export const glossaryTerms: GlossaryTerm\[\] = \[([\s\S]*?)\];/);
    if (!termsArrayMatch) {
      return NextResponse.json({ error: 'Could not parse glossary file' }, { status: 500 });
    }

    const arrayContent = termsArrayMatch[1];

    // Find and remove the specific term
    const termRegex = new RegExp(
      `,?\\s*{[^}]*slug:\\s*'${slug}'[^}]*language:\\s*'${lang}'[^}]*}(?=,?\\s*(?:{|\\]))`,
      's'
    );

    if (!termRegex.test(arrayContent)) {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 });
    }

    // Remove the term
    const updatedArray = arrayContent.replace(termRegex, '').replace(/,(\s*,)/g, ',').trim();
    const updatedContent = fileContent.replace(
      termsArrayMatch[0],
      `export const glossaryTerms: GlossaryTerm[] = [${updatedArray}];`
    );

    // Write back to file
    fs.writeFileSync(glossaryPath, updatedContent, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting term:', error);
    return NextResponse.json({ error: 'Failed to delete term' }, { status: 500 });
  }
}
