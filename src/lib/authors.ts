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

// Dynamic author loading from JSON file
function loadAuthors(): Author[] {
  // Only load from filesystem on server-side
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const authorsPath = path.join(process.cwd(), 'data', 'authors.json');
      
      // Read JSON file
      const fileContent = fs.readFileSync(authorsPath, 'utf-8');
      const authorsArray = JSON.parse(fileContent);
      return authorsArray;
    } catch (e) {
      console.error('Error loading authors from JSON:', e);
      // Fallback to hardcoded authors if JSON file doesn't exist
      return authors;
    }
  }
  // Client-side: return hardcoded authors as fallback
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
