import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import { getPostBySlug } from '@/lib/posts';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
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
    const postsPath = path.join(process.cwd(), 'src', 'lib', 'posts.ts');
    let fileContent = fs.readFileSync(postsPath, 'utf-8');

    // Find the post object - need to match from opening brace to closing brace including nested objects
    // This regex finds the complete post object with the matching slug
    const lines = fileContent.split('\n');
    let inPost = false;
    let braceCount = 0;
    let postStartLine = -1;
    let postEndLine = -1;
    let foundSlug = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this line contains our slug
      if (line.includes(`slug: '${slug}'`)) {
        foundSlug = true;
        // Find the start of this post object (work backwards)
        for (let j = i; j >= 0; j--) {
          if (lines[j].trim() === '{') {
            postStartLine = j;
            break;
          }
        }
      }
      
      // If we found the slug and are tracking the post
      if (foundSlug && postStartLine !== -1) {
        // Count braces from the start line
        for (let j = postStartLine; j < lines.length; j++) {
          const currentLine = lines[j];
          for (const char of currentLine) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
          }
          
          if (braceCount === 0 && j >= postStartLine) {
            postEndLine = j;
            break;
          }
        }
        break;
      }
    }

    if (postStartLine !== -1 && postEndLine !== -1) {
      // Remove the post and handle comma cleanup
      const beforePost = lines.slice(0, postStartLine);
      const afterPost = lines.slice(postEndLine + 1);
      
      // Clean up trailing comma from previous post or leading comma from next post
      if (beforePost.length > 0 && beforePost[beforePost.length - 1].trim().endsWith(',')) {
        // Check if there's a next post
        if (afterPost.length > 0 && afterPost[0].trim() === '') {
          // Remove empty line after deleted post
          afterPost.shift();
        }
      } else if (afterPost.length > 0 && afterPost[0].trim() === ',') {
        // Remove leading comma
        afterPost.shift();
      }
      
      fileContent = beforePost.concat(afterPost).join('\n');
      
      // Clean up any double commas or comma before closing bracket
      fileContent = fileContent.replace(/,(\s*),/g, ',');
      fileContent = fileContent.replace(/,(\s*)\]/g, ']');
      
      fs.writeFileSync(postsPath, fileContent, 'utf-8');
      
      // Clear Node.js module cache to force reload
      delete require.cache[require.resolve('@/lib/posts')];
      
      // Revalidate Next.js cache for all relevant paths
      revalidatePath('/', 'page');
      revalidatePath('/blog/[slug]', 'page');
      revalidatePath(`/blog/${slug}`, 'page');
      revalidatePath('/admin/dashboard', 'page');
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
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
    const updatedPost = await request.json();
    
    console.log('Updating post:', slug);
    console.log('New coverImage:', updatedPost.coverImage);
    
    const postsPath = path.join(process.cwd(), 'src', 'lib', 'posts.ts');
    let fileContent = fs.readFileSync(postsPath, 'utf-8');

    // Create the updated post string
    const updatedPostString = `{
    slug: '${updatedPost.slug}',
    language: '${updatedPost.language || 'both'}',
    title: '${updatedPost.title.replace(/'/g, "\\'")}',
    excerpt: '${updatedPost.excerpt.replace(/'/g, "\\'")}',
    content: \`${updatedPost.content.replace(/`/g, '\\`')}\`,
    date: '${updatedPost.date}',
    author: {
      name: '${updatedPost.author.name.replace(/'/g, "\\'")}',
      avatar: '${updatedPost.author.avatar}'
    },
    coverImage: '${updatedPost.coverImage}',
    tags: [${updatedPost.tags.map((tag: string) => `'${tag}'`).join(', ')}]
  }`;
  
    console.log('Generated updatedPostString coverImage:', updatedPost.coverImage.substring(0, 80) + '...');

    // Find the post object using the same robust method as DELETE
    const lines = fileContent.split('\n');
    let braceCount = 0;
    let postStartLine = -1;
    let postEndLine = -1;
    let foundSlug = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this line contains our slug
      if (line.includes(`slug: '${slug}'`)) {
        foundSlug = true;
        console.log('Found slug at line:', i, '|', line.trim());
        // Find the start of this post object (work backwards)
        for (let j = i; j >= 0; j--) {
          const trimmed = lines[j].trim();
          if (trimmed === '{' || trimmed.startsWith('{')) {
            postStartLine = j;
            console.log('Found opening brace at line:', j, '|', lines[j]);
            break;
          }
        }
      }
      
      // If we found the slug and are tracking the post
      if (foundSlug && postStartLine !== -1) {
        // Count braces from the start line
        for (let j = postStartLine; j < lines.length; j++) {
          const currentLine = lines[j];
          for (const char of currentLine) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
          }
          
          if (braceCount === 0 && j >= postStartLine) {
            postEndLine = j;
            console.log('Found closing brace at line:', j);
            break;
          }
        }
        break;
      }
    }

    if (postStartLine !== -1 && postEndLine !== -1) {
      console.log('Found post at lines:', postStartLine, 'to', postEndLine);
      
      // Replace the old post with the updated one
      const beforePost = lines.slice(0, postStartLine);
      const afterPost = lines.slice(postEndLine + 1);
      
      // Check if we need to preserve comma
      const needsComma = afterPost.length > 0 && 
                        afterPost.some(line => line.trim() && line.trim() !== ']');
      
      console.log('Needs trailing comma:', needsComma);
      
      const updatedLines = [
        ...beforePost,
        updatedPostString + (needsComma ? ',' : ''),
        ...afterPost
      ];
      
      fileContent = updatedLines.join('\n');
      
      console.log('Writing file...');
      fs.writeFileSync(postsPath, fileContent, 'utf-8');
      console.log('File written successfully');
      
      // Touch the file again to trigger Turbopack HMR
      setTimeout(() => {
        const now = new Date();
        fs.utimesSync(postsPath, now, now);
        console.log('✓ Triggered file watch event');
      }, 100);
      
      // Verify the write
      const verifyContent = fs.readFileSync(postsPath, 'utf-8');
      if (verifyContent.includes(updatedPost.coverImage)) {
        console.log('✓ Verified: New coverImage found in file');
      } else {
        console.error('✗ ERROR: New coverImage NOT found in file after write!');
        console.error('Looking for:', updatedPost.coverImage.substring(0, 80));
      }
      
      // Clear Node.js module cache to force reload
      delete require.cache[require.resolve('@/lib/posts')];
      
      // Revalidate Next.js cache for all relevant paths
      try {
        revalidatePath('/', 'page');
        revalidatePath('/blog/[slug]', 'page');
        revalidatePath(`/blog/${slug}`, 'page');
        // Also revalidate the old slug if it changed
        if (slug !== updatedPost.slug) {
          revalidatePath(`/blog/${updatedPost.slug}`, 'page');
        }
        revalidatePath('/admin/dashboard', 'page');
        console.log('✓ Cache invalidated for:', slug);
      } catch (error) {
        console.error('Cache revalidation error:', error);
      }
      
      return NextResponse.json({ success: true, message: 'Post updated successfully' });
    } else {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
