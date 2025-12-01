import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// Load .env.local file
config({ path: path.join(process.cwd(), '.env.local') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Post = {
  slug: string;
  language: 'en' | 'it' | 'both';
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  coverImage: string;
  tags: string[];
};

type TranslationResult = {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
};

async function translatePost(
  post: { title: string; excerpt: string; content: string; tags: string[] },
  targetLang: 'en' | 'it'
): Promise<TranslationResult> {
  const sourceLang = targetLang === 'en' ? 'Italian' : 'English';
  const targetLangFull = targetLang === 'en' ? 'English' : 'Italian';

  console.log(`  Translating title...`);
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

  console.log(`  Translating excerpt...`);
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

  console.log(`  Translating content...`);
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

  console.log(`  Translating tags...`);
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

async function main() {
  console.log('🌐 Translate Missing Posts Script');
  console.log('==================================\n');

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is not set');
    console.log('Please set it in your .env.local file or environment');
    process.exit(1);
  }

  const postsPath = path.join(process.cwd(), 'data', 'posts.json');
  
  if (!fs.existsSync(postsPath)) {
    console.error('❌ Error: posts.json not found at', postsPath);
    process.exit(1);
  }

  const postsContent = fs.readFileSync(postsPath, 'utf-8');
  const posts: Post[] = JSON.parse(postsContent);

  console.log(`📚 Found ${posts.length} total posts\n`);

  // Group posts by slug to find which ones are missing translations
  const postsBySlug = new Map<string, Post[]>();
  for (const post of posts) {
    const existing = postsBySlug.get(post.slug) || [];
    existing.push(post);
    postsBySlug.set(post.slug, existing);
  }

  // Find posts that only have one language version
  const postsNeedingTranslation: { post: Post; targetLang: 'en' | 'it' }[] = [];
  
  for (const [slug, versions] of postsBySlug) {
    if (versions.length === 1) {
      const post = versions[0];
      if (post.language === 'en' || post.language === 'it') {
        const targetLang = post.language === 'en' ? 'it' : 'en';
        postsNeedingTranslation.push({ post, targetLang });
      }
    } else {
      // Check if both languages exist
      const hasEn = versions.some(p => p.language === 'en');
      const hasIt = versions.some(p => p.language === 'it');
      
      if (!hasEn && hasIt) {
        const itPost = versions.find(p => p.language === 'it')!;
        postsNeedingTranslation.push({ post: itPost, targetLang: 'en' });
      } else if (!hasIt && hasEn) {
        const enPost = versions.find(p => p.language === 'en')!;
        postsNeedingTranslation.push({ post: enPost, targetLang: 'it' });
      }
    }
  }

  if (postsNeedingTranslation.length === 0) {
    console.log('✅ All posts already have both language versions!');
    return;
  }

  console.log(`🔄 Found ${postsNeedingTranslation.length} posts needing translation:\n`);
  
  for (const { post, targetLang } of postsNeedingTranslation) {
    console.log(`  - "${post.title}" (${post.language} → ${targetLang})`);
  }
  console.log('');

  // Ask for confirmation
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise<string>((resolve) => {
    rl.question('Do you want to proceed with translation? (y/n): ', resolve);
  });
  rl.close();

  if (answer.toLowerCase() !== 'y') {
    console.log('❌ Translation cancelled');
    return;
  }

  console.log('\n🚀 Starting translations...\n');

  const newPosts: Post[] = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < postsNeedingTranslation.length; i++) {
    const { post, targetLang } = postsNeedingTranslation[i];
    console.log(`[${i + 1}/${postsNeedingTranslation.length}] Translating "${post.title}" to ${targetLang}...`);
    
    try {
      const translation = await translatePost(
        {
          title: post.title,
          excerpt: post.excerpt || '',
          content: post.content,
          tags: post.tags || [],
        },
        targetLang
      );

      const translatedPost: Post = {
        ...post,
        language: targetLang,
        title: translation.title,
        excerpt: translation.excerpt,
        content: translation.content,
        tags: translation.tags,
      };

      newPosts.push(translatedPost);
      successCount++;
      console.log(`  ✅ Done!\n`);

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}\n`);
      errorCount++;
    }
  }

  if (newPosts.length > 0) {
    // Insert translated posts next to their original versions
    const updatedPosts = [...posts];
    
    for (const newPost of newPosts) {
      // Find the index of the original post
      const originalIndex = updatedPosts.findIndex(
        p => p.slug === newPost.slug && p.language !== newPost.language
      );
      
      if (originalIndex !== -1) {
        // Insert right after the original
        updatedPosts.splice(originalIndex + 1, 0, newPost);
      } else {
        // If not found, add at the beginning
        updatedPosts.unshift(newPost);
      }
    }

    // Backup original file
    const backupPath = path.join(process.cwd(), 'data', `posts.backup.${Date.now()}.json`);
    fs.writeFileSync(backupPath, postsContent, 'utf-8');
    console.log(`📦 Backup saved to: ${backupPath}`);

    // Write updated posts
    fs.writeFileSync(postsPath, JSON.stringify(updatedPosts, null, 2), 'utf-8');
    console.log(`💾 Updated posts.json with ${newPosts.length} new translations`);
  }

  console.log('\n==================================');
  console.log(`✅ Completed: ${successCount} translations`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount}`);
  }
  console.log(`📚 Total posts now: ${posts.length + newPosts.length}`);
}

main().catch(console.error);
