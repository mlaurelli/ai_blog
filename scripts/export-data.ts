import fs from 'fs';
import path from 'path';
import { posts } from '../src/lib/posts';
import { glossaryTerms } from '../src/lib/glossary';

// Export posts to JSON
const postsPath = path.join(process.cwd(), 'data', 'posts.json');
fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');
console.log(`✓ Exported ${posts.length} posts to data/posts.json`);

// Export glossary terms to JSON
const glossaryPath = path.join(process.cwd(), 'data', 'glossary.json');
fs.writeFileSync(glossaryPath, JSON.stringify(glossaryTerms, null, 2), 'utf-8');
console.log(`✓ Exported ${glossaryTerms.length} glossary terms to data/glossary.json`);

// Authors are now managed dynamically via JSON file and admin panel
console.log('ℹ Authors are managed via data/authors.json and /admin/authors');
