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
    
    // Revalidate Next.js cache for all relevant paths
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
    
    // Read current posts from JSON
    const postsPath = path.join(process.cwd(), 'data', 'posts.json');
    let posts = [];
    
    try {
      const fileContent = fs.readFileSync(postsPath, 'utf-8');
      posts = JSON.parse(fileContent);
    } catch (e) {
      return NextResponse.json({ error: 'Error reading posts' }, { status: 500 });
    }

    // Find and update the post
    const postIndex = posts.findIndex((p: any) => p.slug === slug);
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    posts[postIndex] = updatedPost;
    
    // Write back to JSON file
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');
    
    console.log('✓ Post updated successfully');
    
    // Revalidate Next.js cache for all relevant paths
    revalidatePath('/', 'page');
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath(`/blog/${slug}`, 'page');
    // Also revalidate the old slug if it changed
    if (slug !== updatedPost.slug) {
      revalidatePath(`/blog/${updatedPost.slug}`, 'page');
    }
    revalidatePath('/admin/dashboard', 'page');
    console.log('✓ Cache invalidated for:', slug);
    
    return NextResponse.json({ success: true, message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
