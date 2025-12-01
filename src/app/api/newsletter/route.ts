import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import { getAllNewsletters, getNewsletterById, saveNewsletter, deleteNewsletter } from '@/lib/newsletter';

// GET all newsletters
export async function GET(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newsletters = getAllNewsletters();
    return NextResponse.json(newsletters);
  } catch (error: any) {
    console.error('Error fetching newsletters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletters', details: error.message },
      { status: 500 }
    );
  }
}

// POST save newsletter draft
export async function POST(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newsletter = await request.json();
    
    if (!newsletter.id) {
      newsletter.id = `newsletter-${Date.now()}`;
    }
    
    if (!newsletter.status) {
      newsletter.status = 'draft';
    }

    saveNewsletter(newsletter);

    return NextResponse.json({
      success: true,
      message: 'Newsletter saved',
      newsletter,
    });
  } catch (error: any) {
    console.error('Error saving newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to save newsletter', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE newsletter
export async function DELETE(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Newsletter ID is required' },
        { status: 400 }
      );
    }

    const deleted = deleteNewsletter(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Newsletter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Newsletter deleted',
    });
  } catch (error: any) {
    console.error('Error deleting newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to delete newsletter', details: error.message },
      { status: 500 }
    );
  }
}
