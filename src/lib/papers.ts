export type Paper = {
  slug: string;
  arxivId: string;
  title: string;
  authors: string[];
  abstract: string;
  aiExplanation: string; // AI-generated simple explanation
  publishedDate: string; // ISO date string
  updatedDate?: string;
  categories: string[];
  pdfUrl: string;
  arxivUrl: string;
  language: 'en' | 'it' | 'both';
};

// Map arXiv category codes to human-readable labels
export const CATEGORY_LABELS: Record<string, string> = {
  'cs.AI': 'Artificial Intelligence',
  'cs.LG': 'Machine Learning',
  'cs.CL': 'Computation and Language',
  'cs.CV': 'Computer Vision',
  'cs.NE': 'Neural Networks',
  'cs.RO': 'Robotics',
  'cs.IR': 'Information Retrieval',
  'stat.ML': 'Machine Learning (Statistics)',
  'math.OC': 'Optimization and Control',
  'cs.HC': 'Human-Computer Interaction',
  'cs.CR': 'Cryptography and Security',
  'cs.GT': 'Game Theory',
  'cs.MA': 'Multiagent Systems',
  'cs.SI': 'Social Networks',
  'eess.IV': 'Image Processing',
  'eess.AS': 'Audio and Speech',
  'q-bio.NC': 'Neurons and Cognition',
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}

// Dynamic paper loading from JSON file
function loadPapers(): Paper[] {
  // Only load from filesystem on server-side
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const papersPath = path.join(process.cwd(), 'data', 'papers.json');
      
      // Read JSON file
      const fileContent = fs.readFileSync(papersPath, 'utf-8');
      const papersArray = JSON.parse(fileContent);
      return papersArray;
    } catch (e) {
      console.error('Error loading papers from JSON:', e);
      return [];
    }
  }
  // Client-side: return empty array
  return [];
}

export function getPaperBySlug(slug: string): Paper | undefined {
  return loadPapers().find((paper) => paper.slug === slug);
}

export function getAllPapers(): Paper[] {
  return loadPapers()
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

export function getPapersByCategory(category: string): Paper[] {
  return loadPapers()
    .filter(paper => paper.categories.includes(category))
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}
