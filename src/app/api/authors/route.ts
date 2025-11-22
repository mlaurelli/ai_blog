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
    
    // Read current authors
    const authorsPath = path.join(process.cwd(), 'src', 'lib', 'authors.ts');
    let fileContent = fs.readFileSync(authorsPath, 'utf-8');
    
    const newAuthorString = `  {
    id: '${newAuthor.id}',
    name: '${newAuthor.name.replace(/'/g, "\\'")}',
    bio: '${newAuthor.bio.replace(/'/g, "\\'")}',
    avatar: '${newAuthor.avatar}',
    role: '${newAuthor.role.replace(/'/g, "\\'")}',${newAuthor.email ? `\n    email: '${newAuthor.email}',` : ''}${newAuthor.website ? `\n    website: '${newAuthor.website}',` : ''}${newAuthor.twitter ? `\n    twitter: '${newAuthor.twitter}',` : ''}${newAuthor.linkedin ? `\n    linkedin: '${newAuthor.linkedin}',` : ''}${newAuthor.github ? `\n    github: '${newAuthor.github}',` : ''}
    seo: {
      title: '${newAuthor.seo.title.replace(/'/g, "\\'")}',
      description: '${newAuthor.seo.description.replace(/'/g, "\\'")}',
      keywords: [${newAuthor.seo.keywords.map((kw: string) => `'${kw}'`).join(', ')}]
    }
  }`;

    // Add the new author at the beginning of the array
    fileContent = fileContent.replace(
      /export const authors: Author\[\] = \[/,
      `export const authors: Author[] = [\n${newAuthorString},`
    );

    fs.writeFileSync(authorsPath, fileContent, 'utf-8');

    // Clear Node.js module cache to force reload
    delete require.cache[require.resolve('@/lib/authors')];

    // Revalidate Next.js cache
    revalidatePath('/authors', 'layout');
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json({ error: 'Failed to create author' }, { status: 500 });
  }
}
