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
    
    const authorsPath = path.join(process.cwd(), 'src', 'lib', 'authors.ts');
    let fileContent = fs.readFileSync(authorsPath, 'utf-8');

    // Create the updated author string
    const updatedAuthorString = `{
    id: '${updatedAuthor.id}',
    name: '${updatedAuthor.name.replace(/'/g, "\\'")}',
    bio: '${updatedAuthor.bio.replace(/'/g, "\\'")}',
    avatar: '${updatedAuthor.avatar}',
    role: '${updatedAuthor.role.replace(/'/g, "\\'")}',${updatedAuthor.email ? `\n    email: '${updatedAuthor.email}',` : ''}${updatedAuthor.website ? `\n    website: '${updatedAuthor.website}',` : ''}${updatedAuthor.twitter ? `\n    twitter: '${updatedAuthor.twitter}',` : ''}${updatedAuthor.linkedin ? `\n    linkedin: '${updatedAuthor.linkedin}',` : ''}${updatedAuthor.github ? `\n    github: '${updatedAuthor.github}',` : ''}
    seo: {
      title: '${updatedAuthor.seo.title.replace(/'/g, "\\'")}',
      description: '${updatedAuthor.seo.description.replace(/'/g, "\\'")}',
      keywords: [${updatedAuthor.seo.keywords.map((kw: string) => `'${kw}'`).join(', ')}]
    }
  }`;

    // Find and replace using line-by-line parsing
    const lines = fileContent.split('\n');
    let braceCount = 0;
    let authorStartLine = -1;
    let authorEndLine = -1;
    let foundId = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes(`id: '${id}'`)) {
        foundId = true;
        for (let j = i; j >= 0; j--) {
          const trimmed = lines[j].trim();
          if (trimmed === '{' || trimmed.startsWith('{')) {
            authorStartLine = j;
            break;
          }
        }
      }
      
      if (foundId && authorStartLine !== -1) {
        for (let j = authorStartLine; j < lines.length; j++) {
          const currentLine = lines[j];
          for (const char of currentLine) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
          }
          
          if (braceCount === 0 && j >= authorStartLine) {
            authorEndLine = j;
            break;
          }
        }
        break;
      }
    }

    if (authorStartLine !== -1 && authorEndLine !== -1) {
      const beforeAuthor = lines.slice(0, authorStartLine);
      const afterAuthor = lines.slice(authorEndLine + 1);
      
      const needsComma = afterAuthor.length > 0 && 
                        afterAuthor.some(line => line.trim() && line.trim() !== ']');
      
      const updatedLines = [
        ...beforeAuthor,
        updatedAuthorString + (needsComma ? ',' : ''),
        ...afterAuthor
      ];
      
      fileContent = updatedLines.join('\n');
      
      fs.writeFileSync(authorsPath, fileContent, 'utf-8');
      
      // Touch file to trigger HMR
      setTimeout(() => {
        const now = new Date();
        fs.utimesSync(authorsPath, now, now);
      }, 100);
      
      // Clear cache
      delete require.cache[require.resolve('@/lib/authors')];
      
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
    } else {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }
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
    const authorsPath = path.join(process.cwd(), 'src', 'lib', 'authors.ts');
    let fileContent = fs.readFileSync(authorsPath, 'utf-8');

    const lines = fileContent.split('\n');
    let braceCount = 0;
    let authorStartLine = -1;
    let authorEndLine = -1;
    let foundId = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes(`id: '${id}'`)) {
        foundId = true;
        for (let j = i; j >= 0; j--) {
          if (lines[j].trim() === '{') {
            authorStartLine = j;
            break;
          }
        }
      }
      
      if (foundId && authorStartLine !== -1) {
        for (let j = authorStartLine; j < lines.length; j++) {
          const currentLine = lines[j];
          for (const char of currentLine) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
          }
          
          if (braceCount === 0 && j >= authorStartLine) {
            authorEndLine = j;
            break;
          }
        }
        break;
      }
    }

    if (authorStartLine !== -1 && authorEndLine !== -1) {
      const beforeAuthor = lines.slice(0, authorStartLine);
      const afterAuthor = lines.slice(authorEndLine + 1);
      
      if (beforeAuthor.length > 0 && beforeAuthor[beforeAuthor.length - 1].trim().endsWith(',')) {
        if (afterAuthor.length > 0 && afterAuthor[0].trim() === '') {
          afterAuthor.shift();
        }
      }
      
      fileContent = beforeAuthor.concat(afterAuthor).join('\n');
      fileContent = fileContent.replace(/,(\s*),/g, ',');
      fileContent = fileContent.replace(/,(\s*)\]/g, ']');
      
      fs.writeFileSync(authorsPath, fileContent, 'utf-8');
      
      delete require.cache[require.resolve('@/lib/authors')];
      
      revalidatePath('/authors', 'layout');
      revalidatePath('/', 'layout');
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json({ error: 'Failed to delete author' }, { status: 500 });
  }
}
