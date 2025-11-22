import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt che definisce lo stile del blog
const BLOG_STYLE_PROMPT = `You are an expert AI/ML technical writer for a high-quality blog called "AI Blog by Michele Laurelli".

The blog's style guidelines:
- Scientific integrity and engineering precision
- Deep technical content with human depth
- Clear, engaging explanations without oversimplification
- Newspaper-style formatting with proper sections
- Professional yet accessible tone
- Mix of theory, practical examples, and real-world applications
- Bilingual content (English and Italian)

When generating articles:
1. Create comprehensive, well-researched content
2. Use clear section headings
3. Include practical examples and code snippets where relevant
4. Maintain a professional newspaper-like structure
5. Be technically accurate and thorough
6. Write in a way that's both educational and engaging`;

export async function POST(req: NextRequest) {
  try {
    const { title, imageSource, language } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    console.log('Generating article for:', title);

    // Step 1: Generate the article content
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: BLOG_STYLE_PROMPT,
        },
        {
          role: 'user',
          content: `Write a comprehensive blog article about: "${title}"

Requirements:
- Language: ${language === 'both' ? 'Write in English (Italian version will be generated separately)' : language === 'en' ? 'English' : 'Italian'}
- Length: 1500-2000 words
- Include clear sections with headers
- Add practical examples where relevant
- Format for markdown rendering
- Maintain professional newspaper style
- Be technically accurate and thorough

Generate ONLY the article content, no meta information.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0].message.content || '';

    // Step 2: Generate excerpt
    const excerptCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at writing concise, engaging article summaries. Keep them short and punchy to encourage clicks.',
        },
        {
          role: 'user',
          content: `Write a brief ONE sentence excerpt for this article about "${title}". Make it engaging and intriguing - it should make people want to click and read more. Maximum 20 words.\n\nArticle:\n${content.substring(0, 1000)}...`,
        },
      ],
      temperature: 0.7,
      max_tokens: 60,
    });

    const excerpt = excerptCompletion.choices[0].message.content || '';

    // Step 3: Generate tags
    const tagsCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at categorizing technical content.',
        },
        {
          role: 'user',
          content: `Generate 5-7 relevant tags for an article titled "${title}". Return ONLY comma-separated tags, no explanation.`,
        },
      ],
      temperature: 0.5,
      max_tokens: 100,
    });

    const tags = tagsCompletion.choices[0].message.content || '';

    // Step 4: Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Step 5: Generate or find image
    let coverImage = '';

    if (imageSource === 'ai') {
      // Generate image with DALL-E
      console.log('Generating image with DALL-E...');
      const imageCompletion = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `A professional, modern, minimalist illustration for a technical blog article about: ${title}. Style: clean, professional, tech-focused, suitable for a newspaper-style blog. No text in image.`,
        n: 1,
        size: '1792x1024',
        quality: 'standard',
      });

      if (imageCompletion.data && imageCompletion.data[0]?.url) {
        coverImage = imageCompletion.data[0].url;
      }
    } else {
      // Find image on Unsplash using AI to determine best search query
      const unsplashQueryCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at finding relevant stock photos.',
          },
          {
            role: 'user',
            content: `For an article titled "${title}", what would be the best 1-3 word search query for Unsplash to find a relevant, professional image? Return ONLY the search query, no explanation.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 20,
      });

      const searchQuery = unsplashQueryCompletion.choices[0].message.content
        ?.trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '%20') || 'technology';

      coverImage = `https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop&q=${searchQuery}`;
    }

    // Step 6: Generate Italian version if needed
    let italianContent = '';
    let italianExcerpt = '';

    if (language === 'both') {
      const italianCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: BLOG_STYLE_PROMPT,
          },
          {
            role: 'user',
            content: `Translate this article to Italian, maintaining the same technical accuracy, structure, and professional tone:\n\n${content}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      italianContent = italianCompletion.choices[0].message.content || '';

      const italianExcerptCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at writing concise, engaging article summaries in Italian. Keep them short and punchy to encourage clicks.',
          },
          {
            role: 'user',
            content: `Write a brief ONE sentence excerpt in Italian for this article about "${title}". Make it engaging and intriguing - it should make people want to click and read more. Maximum 20 words.\n\nArticle:\n${italianContent.substring(0, 1000)}...`,
          },
        ],
        temperature: 0.7,
        max_tokens: 60,
      });

      italianExcerpt = italianExcerptCompletion.choices[0].message.content || '';
    }

    return NextResponse.json({
      success: true,
      post: {
        title,
        slug,
        content,
        excerpt,
        tags: tags.split(',').map(tag => tag.trim()),
        coverImage,
        language,
        ...(language === 'both' && {
          italianContent,
          italianExcerpt,
        }),
      },
    });
  } catch (error: any) {
    console.error('Error generating post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate post' },
      { status: 500 }
    );
  }
}
