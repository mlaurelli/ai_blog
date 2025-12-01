import { NextRequest, NextResponse } from 'next/server';
import { translatePost } from '@/lib/translate';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const token = getTokenFromHeaders(req.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, excerpt, content, tags, targetLang } = await req.json();

    if (!title || !content || !targetLang) {
      return NextResponse.json(
        { error: 'Title, content, and targetLang are required' },
        { status: 400 }
      );
    }

    if (!['en', 'it'].includes(targetLang)) {
      return NextResponse.json(
        { error: 'targetLang must be "en" or "it"' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    console.log(`Translating post to ${targetLang}:`, title);

    const translation = await translatePost(
      {
        title,
        excerpt: excerpt || '',
        content,
        tags: tags || [],
      },
      targetLang as 'en' | 'it'
    );

    console.log(`Translation completed for: ${title}`);

    return NextResponse.json({
      success: true,
      translation,
    });
  } catch (error: any) {
    console.error('Error translating post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to translate post' },
      { status: 500 }
    );
  }
}
