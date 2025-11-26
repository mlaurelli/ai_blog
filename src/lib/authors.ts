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

// No hardcoded authors - all data loaded dynamically from JSON file

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
      return [];
    }
  }
  // Client-side: return empty array (client should use API instead)
  console.warn('loadAuthors() called on client-side. Use /api/authors instead.');
  return [];
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
