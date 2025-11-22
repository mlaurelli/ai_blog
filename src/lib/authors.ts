export type Author = {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  role: string;
  email?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

export const authors: Author[] = [
{
    id: 'michele-laurelli',
    name: 'Michele Laurelli',
    bio: 'AI Architect & Researcher specializing in private AI models and systems, autonomous agents, and AI architectures. Founder of Algoretico. University professor adj and author. ',
    avatar: '/uploads/1763752568910-michele-laurelli.jpg',
    role: 'Founder & AI Architect',
    email: 'm.laurelli@algoretico.com',
    website: 'https://michelelaurelli.com',
    linkedin: 'michelelaurelli',
    github: 'mlaurelli',
    seo: {
      title: 'Michele Laurelli - AI Expert',
      description: 'Expert in private AI systems, autonomous agents, and deep learning architectures. University Professor and Author. ',
      keywords: ['AI Architect', 'Machine Learning', 'Deep Learning', 'Private AI', 'Autonomous Agents', 'AI Research']
    }
  },
];

// Dynamic author loading to avoid Turbopack caching issues
function loadAuthors(): Author[] {
  // In development, re-parse the file to get latest changes
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
    try {
      const fs = require('fs');
      const path = require('path');
      const authorsPath = path.join(process.cwd(), 'src', 'lib', 'authors.ts');
      const fileContent = fs.readFileSync(authorsPath, 'utf-8');
      
      // Extract the authors array using regex
      const match = fileContent.match(/export const authors: Author\[\] = (\[[\s\S]*?\n\]);/);
      if (match) {
        const authorsArray = eval(match[1]);
        console.log('[loadAuthors] Loaded', authorsArray.length, 'authors dynamically from file');
        if (authorsArray[0]) {
          console.log('[loadAuthors] First author avatar:', authorsArray[0].avatar.substring(0, 60) + '...');
        }
        return authorsArray;
      }
    } catch (e) {
      console.error('Error dynamically loading authors:', e);
    }
  }
  console.log('[loadAuthors] Using static authors array');
  return authors;
}

export function getAuthorById(id: string): Author | undefined {
  return loadAuthors().find((author) => author.id === id);
}

export function getAllAuthors(): Author[] {
  return loadAuthors();
}

export function getAuthorByName(name: string): Author | undefined {
  return loadAuthors().find((author) => author.name === name);
}
