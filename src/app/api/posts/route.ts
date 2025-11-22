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
    
    // Read current posts from JSON
    const postsPath = path.join(process.cwd(), 'data', 'posts.json');
    let posts = [];
    
    try {
      const fileContent = fs.readFileSync(postsPath, 'utf-8');
      posts = JSON.parse(fileContent);
    } catch (e) {
      console.error('Error reading posts.json:', e);
      posts = [];
    }

    // Add the new post at the beginning of the array
    posts.unshift(newPost);

    // Write back to JSON file
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');

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

    // Read current posts from JSON
    const postsPath = path.join(process.cwd(), 'data', 'posts.json');
    let posts = [];
    
    try {
      const fileContent = fs.readFileSync(postsPath, 'utf-8');
      posts = JSON.parse(fileContent);
    } catch (e) {
      return NextResponse.json({ error: 'Error reading posts' }, { status: 500 });
    }

    // Find and remove the post
    const postIndex = posts.findIndex((p: any) => p.slug === slug);
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    posts.splice(postIndex, 1);
    
    // Write back to JSON file
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');

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
