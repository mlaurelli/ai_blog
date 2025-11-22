import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GLOSSARY_STYLE_PROMPT = `You are an expert AI/ML technical writer creating dictionary-style definitions for an AI glossary.

Style guidelines:
- Scientific precision and clarity
- Dictionary/encyclopedia style
- Comprehensive but accessible
- Technical accuracy is paramount
- Include practical context and real-world applications
- Professional, authoritative tone`;

export async function POST(req: NextRequest) {
  try {
    const { term, language } = await req.json();

    if (!term) {
      return NextResponse.json({ error: 'Term is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    console.log('Generating glossary term for:', term);

    // Step 1: Generate comprehensive term content
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: GLOSSARY_STYLE_PROMPT,
        },
        {
          role: 'user',
          content: `Create a comprehensive glossary entry for the AI/ML term: "${term}"

Language: ${language === 'it' ? 'Italian' : 'English'}

Generate a JSON response with this exact structure:
{
  "category": "category name (e.g., Architecture, Algorithm, Technique, Concept)",
  "pronunciation": "IPA pronunciation (e.g., /ˈnjʊərəl ˈnetwɜːrk/)",
  "definition": "Brief 1-2 sentence definition",
  "explanation": "Detailed explanation in Markdown format (500-800 words). Include:
    - ## Introduction
    - ## How it Works
    - ## Key Characteristics
    - ## Applications
    - ## Advantages and Limitations
    Use proper Markdown formatting with headers, bold, italic, lists.",
  "examples": [
    "Example 1 showing practical application",
    "Example 2 with different use case",
    "Example 3 demonstrating concept"
  ],
  "etymology": "Origin and history of the term (2-3 sentences)",
  "relatedTerms": [
    "related-term-slug-1",
    "related-term-slug-2",
    "related-term-slug-3"
  ]
}

Important:
- Definition must be concise (1-2 sentences max)
- Explanation should be comprehensive with proper Markdown sections
- Examples should be practical and illustrative
- Related term slugs should be lowercase-with-hyphens
- Be technically accurate and authoritative`,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content || '{}';
    const glossaryData = JSON.parse(content);

    // Step 2: Generate slug
    const slug = term
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    return NextResponse.json({
      success: true,
      term: {
        slug,
        term,
        language,
        category: glossaryData.category || 'General',
        pronunciation: glossaryData.pronunciation || '',
        definition: glossaryData.definition || '',
        explanation: glossaryData.explanation || '',
        examples: glossaryData.examples || [],
        relatedTerms: glossaryData.relatedTerms || [],
        etymology: glossaryData.etymology || '',
      },
    });
  } catch (error: any) {
    console.error('Error generating glossary term:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate glossary term' },
      { status: 500 }
    );
  }
}
