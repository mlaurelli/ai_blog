import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type TranslationResult = {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
};

/**
 * Translates a post from one language to another using OpenAI
 * @param post - The post content to translate
 * @param targetLang - Target language ('en' or 'it')
 * @returns Translated title, excerpt, content, and tags
 */
export async function translatePost(
  post: {
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
  },
  targetLang: 'en' | 'it'
): Promise<TranslationResult> {
  const sourceLang = targetLang === 'en' ? 'Italian' : 'English';
  const targetLangFull = targetLang === 'en' ? 'English' : 'Italian';

  // Translate title
  const titleCompletion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator specializing in technical AI/ML content. Translate from ${sourceLang} to ${targetLangFull}. Maintain the same tone, technical accuracy, and style. Return ONLY the translation, no explanations.`,
      },
      {
        role: 'user',
        content: `Translate this article title:\n\n${post.title}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 200,
  });

  const translatedTitle = titleCompletion.choices[0].message.content?.trim() || post.title;

  // Translate excerpt
  const excerptCompletion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator specializing in technical AI/ML content. Translate from ${sourceLang} to ${targetLangFull}. Keep the excerpt concise and engaging. Return ONLY the translation, no explanations.`,
      },
      {
        role: 'user',
        content: `Translate this article excerpt:\n\n${post.excerpt}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 200,
  });

  const translatedExcerpt = excerptCompletion.choices[0].message.content?.trim() || post.excerpt;

  // Translate content
  const contentCompletion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator specializing in technical AI/ML content. Translate from ${sourceLang} to ${targetLangFull}. 
        
Rules:
- Maintain the same technical accuracy, structure, and professional tone
- Preserve all markdown/HTML formatting exactly
- Keep code snippets unchanged
- Translate headings, paragraphs, and lists
- Maintain the same paragraph structure
- Return ONLY the translated content, no explanations or meta-commentary`,
      },
      {
        role: 'user',
        content: `Translate this article content:\n\n${post.content}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 8000,
  });

  const translatedContent = contentCompletion.choices[0].message.content?.trim() || post.content;

  // Translate tags
  const tagsCompletion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate these tags from ${sourceLang} to ${targetLangFull}. Return ONLY comma-separated tags, no explanations. Keep technical terms that are commonly used in ${targetLangFull} (like "AI", "Machine Learning") as-is if they're standard in that language.`,
      },
      {
        role: 'user',
        content: `Translate these tags: ${post.tags.join(', ')}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 100,
  });

  const translatedTags = tagsCompletion.choices[0].message.content
    ?.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0) || post.tags;

  return {
    title: translatedTitle,
    excerpt: translatedExcerpt,
    content: translatedContent,
    tags: translatedTags,
  };
}

/**
 * Detects if a post needs translation and returns the missing language
 * @param post - The post to check
 * @returns 'en' if English translation needed, 'it' if Italian needed, null if both exist
 */
export function detectMissingTranslation(post: {
  language: 'en' | 'it' | 'both';
}): 'en' | 'it' | null {
  if (post.language === 'both') {
    return null; // Already has both languages
  }
  return post.language === 'en' ? 'it' : 'en';
}
