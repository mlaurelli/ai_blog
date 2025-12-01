import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { posts, language = 'en' } = await request.json();

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { error: 'Posts array is required' },
        { status: 400 }
      );
    }

    // Create prompt for AI
    const postsList = posts.map((post: any, index: number) => 
      `${index + 1}. "${post.title}" - ${post.excerpt}`
    ).join('\n\n');

    const languageInstructions = language === 'it' 
      ? 'Write everything in ITALIAN. Use a professional, technical yet accessible tone in Italian.'
      : 'Write everything in ENGLISH. Use a professional, technical yet accessible tone.';

    const prompt = `You are writing a newsletter introduction for "AI Blog" by Michele Laurelli. This is a sophisticated technical blog about artificial intelligence, machine learning, and AI engineering.

${languageInstructions}

The newsletter includes these articles:

${postsList}

Generate:
1. A compelling email subject line (max 60 characters, engaging and professional)
2. A warm, intelligent introduction (2-3 paragraphs) that:
   - Welcomes readers
   - Provides context on the selected articles
   - Creates anticipation without being clickbaity
   - Maintains a tone that is technical yet accessible, authoritative yet human
   - Reflects Michele's voice: direct, insightful, no hype

Format your response as JSON:
{
  "subject": "your subject line here",
  "introduction": "your introduction text here (use \\n for paragraph breaks)"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a professional newsletter writer for a technical AI blog. Always respond with valid JSON. ${languageInstructions}`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from AI');
    }

    // Parse AI response
    const aiResponse = JSON.parse(content);

    return NextResponse.json({
      subject: aiResponse.subject,
      introduction: aiResponse.introduction,
    });

  } catch (error: any) {
    console.error('Error generating newsletter content:', error);
    return NextResponse.json(
      { error: 'Failed to generate newsletter content', details: error.message },
      { status: 500 }
    );
  }
}
