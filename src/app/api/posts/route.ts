import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllPostsAdmin } from '@/lib/posts';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Return ALL posts (both EN and IT) for admin dashboard
  const posts = getAllPostsAdmin();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newPost = await request.json();
    
    // Read current posts
    const postsPath = path.join(process.cwd(), 'src', 'lib', 'posts.ts');
    let fileContent = fs.readFileSync(postsPath, 'utf-8');
    
    // Find the posts array and insert the new post
    const postsArrayMatch = fileContent.match(/export const posts: Post\[\] = \[([\s\S]*?)\];/);
    if (!postsArrayMatch) {
      return NextResponse.json({ error: 'Could not parse posts file' }, { status: 500 });
    }

    const newPostString = `  {
    slug: '${newPost.slug}',
    language: '${newPost.language || 'both'}',
    title: '${newPost.title.replace(/'/g, "\\'")}',
    excerpt: '${newPost.excerpt.replace(/'/g, "\\'")}',
    content: \`${newPost.content.replace(/`/g, '\\`')}\`,
    date: '${newPost.date}',
    author: {
      name: '${newPost.author.name.replace(/'/g, "\\'")}',
      avatar: '${newPost.author.avatar}'
    },
    coverImage: '${newPost.coverImage}',
    tags: [${newPost.tags.map((tag: string) => `'${tag}'`).join(', ')}]
  }`;

    // Add the new post at the beginning of the array
    fileContent = fileContent.replace(
      /export const posts: Post\[\] = \[/,
      `export const posts: Post[] = [\n${newPostString},`
    );

    fs.writeFileSync(postsPath, fileContent, 'utf-8');

    // Clear Node.js module cache to force reload
    delete require.cache[require.resolve('@/lib/posts')];

    // Revalidate Next.js cache for all relevant paths
    revalidatePath('/', 'page');
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath(`/blog/${newPost.slug}`, 'page');
    revalidatePath('/admin/dashboard', 'page');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
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

    // Read current posts file
    const postsPath = path.join(process.cwd(), 'src', 'lib', 'posts.ts');
    let fileContent = fs.readFileSync(postsPath, 'utf-8');
    
    // Find and remove the post - more robust regex that handles multi-line content
    // Match from opening brace with slug to the closing brace and comma
    const postRegex = new RegExp(`{[\\s\\S]*?slug:\\s*'${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?tags:\\s*\\[[\\s\\S]*?\\]\\s*}\\s*,?`, 'g');
    
    if (!postRegex.test(fileContent)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Remove the post
    fileContent = fileContent.replace(postRegex, '');
    
    // Clean up double commas and empty lines
    fileContent = fileContent.replace(/,(\s*),/g, ',');
    fileContent = fileContent.replace(/,(\s*)\]/g, ']');
    fileContent = fileContent.replace(/\[\s*,/g, '[');
    fileContent = fileContent.replace(/\n\n\n+/g, '\n\n');
    
    // Write back to file
    fs.writeFileSync(postsPath, fileContent, 'utf-8');

    // Clear Node.js module cache
    delete require.cache[require.resolve('@/lib/posts')];

    // Revalidate paths
    revalidatePath('/', 'page');
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath(`/blog/${slug}`, 'page');
    revalidatePath('/admin/dashboard', 'page');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
