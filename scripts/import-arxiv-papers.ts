import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ArxivEntry {
  id: string;
  title: string;
  summary: string;
  published: string;
  updated: string;
  authors: { name: string }[];
  categories: string[];
  links: { href: string; rel: string; type?: string }[];
}

interface ArxivResponse {
  feed: {
    entry: ArxivEntry | ArxivEntry[];
  };
}

// Fetch papers from arXiv API
async function fetchArxivPapers(query: string, maxResults: number = 10): Promise<ArxivEntry[]> {
  const baseUrl = 'http://export.arxiv.org/api/query';
  const params = new URLSearchParams({
    search_query: query,
    start: '0',
    max_results: maxResults.toString(),
    sortBy: 'submittedDate',
    sortOrder: 'descending',
  });

  const response = await fetch(`${baseUrl}?${params}`);
  const xmlText = await response.text();
  
  // Parse XML response (simple parsing for arXiv API)
  const entries = parseArxivXML(xmlText);
  return entries;
}

// Simple XML parser for arXiv API response
function parseArxivXML(xml: string): ArxivEntry[] {
  const entries: ArxivEntry[] = [];
  
  // Split by entry tags
  const entryMatches = xml.match(/<entry>([\s\S]*?)<\/entry>/g);
  if (!entryMatches) return entries;

  for (const entryXml of entryMatches) {
    // Extract ID
    const idMatch = entryXml.match(/<id>(.*?)<\/id>/);
    const id = idMatch ? idMatch[1].replace('http://arxiv.org/abs/', '') : '';

    // Extract title
    const titleMatch = entryXml.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].trim().replace(/\n\s+/g, ' ') : '';

    // Extract summary
    const summaryMatch = entryXml.match(/<summary>([\s\S]*?)<\/summary>/);
    const summary = summaryMatch ? summaryMatch[1].trim().replace(/\n\s+/g, ' ') : '';

    // Extract published date
    const publishedMatch = entryXml.match(/<published>(.*?)<\/published>/);
    const published = publishedMatch ? publishedMatch[1] : '';

    // Extract updated date
    const updatedMatch = entryXml.match(/<updated>(.*?)<\/updated>/);
    const updated = updatedMatch ? updatedMatch[1] : '';

    // Extract authors
    const authorMatches = entryXml.match(/<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g);
    const authors = authorMatches 
      ? authorMatches.map(a => {
          const nameMatch = a.match(/<name>(.*?)<\/name>/);
          return { name: nameMatch ? nameMatch[1] : '' };
        })
      : [];

    // Extract categories
    const categoryMatches = entryXml.match(/<category term="(.*?)"\/>/g);
    const categories = categoryMatches
      ? categoryMatches.map(c => {
          const match = c.match(/term="(.*?)"/);
          return match ? match[1] : '';
        }).filter(Boolean)
      : [];

    // Extract links
    const linkMatches = entryXml.match(/<link.*?\/>/g);
    const links = linkMatches
      ? linkMatches.map(l => {
          const hrefMatch = l.match(/href="(.*?)"/);
          const relMatch = l.match(/rel="(.*?)"/);
          const typeMatch = l.match(/type="(.*?)"/);
          return {
            href: hrefMatch ? hrefMatch[1] : '',
            rel: relMatch ? relMatch[1] : '',
            type: typeMatch ? typeMatch[1] : undefined,
          };
        })
      : [];

    if (id && title && summary) {
      entries.push({
        id,
        title,
        summary,
        published,
        updated,
        authors,
        categories,
        links,
      });
    }
  }

  return entries;
}

// Generate AI explanation using OpenAI
async function generateAIExplanation(title: string, abstract: string): Promise<string> {
  const prompt = `You are an AI research expert. Given the following research paper title and abstract, provide a clear, concise explanation (5-10 lines maximum) that:

1. Explains what the paper is about in simple terms
2. Highlights why this research is important
3. Describes the key contributions or findings
4. Makes it accessible to a general technical audience

Title: ${title}

Abstract: ${abstract}

Provide only the explanation, without any preamble or additional text.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 300,
  });

  return completion.choices[0].message.content?.trim() || '';
}

// Convert arXiv entry to Paper format
async function convertToPaper(entry: ArxivEntry): Promise<any> {
  console.log(`Processing: ${entry.title.substring(0, 60)}...`);
  
  const aiExplanation = await generateAIExplanation(entry.title, entry.summary);
  
  const pdfLink = entry.links.find(l => l.type === 'application/pdf');
  const slug = entry.id.replace(/\//g, '-').replace(/\./g, '-');

  return {
    slug,
    arxivId: entry.id,
    title: entry.title,
    authors: entry.authors.map(a => a.name),
    abstract: entry.summary,
    aiExplanation,
    publishedDate: entry.published,
    updatedDate: entry.updated !== entry.published ? entry.updated : undefined,
    categories: entry.categories,
    pdfUrl: pdfLink ? pdfLink.href : `http://arxiv.org/pdf/${entry.id}.pdf`,
    arxivUrl: `https://arxiv.org/abs/${entry.id}`,
    language: 'en',
  };
}

// Main import function
async function importPapers() {
  console.log('🔍 Fetching papers from arXiv...');
  
  // Search for AI papers
  const query = 'cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV';
  const entries = await fetchArxivPapers(query, 50);
  
  console.log(`✅ Found ${entries.length} papers`);
  console.log('');
  
  console.log('🤖 Generating AI explanations...');
  const papers = [];
  
  for (const entry of entries) {
    const paper = await convertToPaper(entry);
    papers.push(paper);
    // Wait a bit to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('');
  console.log('💾 Saving to papers.json...');
  
  const papersPath = path.join(process.cwd(), 'data', 'papers.json');
  fs.writeFileSync(papersPath, JSON.stringify(papers, null, 2), 'utf-8');
  
  console.log('');
  console.log(`✅ Successfully imported ${papers.length} papers!`);
  console.log(`📁 Saved to: ${papersPath}`);
}

// Run the import
importPapers().catch(console.error);
