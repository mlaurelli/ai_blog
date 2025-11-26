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

// Fetch papers from arXiv API
async function fetchArxivPapers(query: string, maxResults: number = 20): Promise<ArxivEntry[]> {
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
  
  const entries = parseArxivXML(xmlText);
  return entries;
}

// Simple XML parser for arXiv API response
function parseArxivXML(xml: string): ArxivEntry[] {
  const entries: ArxivEntry[] = [];
  
  const entryMatches = xml.match(/<entry>([\s\S]*?)<\/entry>/g);
  if (!entryMatches) return entries;

  for (const entryXml of entryMatches) {
    const idMatch = entryXml.match(/<id>(.*?)<\/id>/);
    const id = idMatch ? idMatch[1].replace('http://arxiv.org/abs/', '') : '';

    const titleMatch = entryXml.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].trim().replace(/\n\s+/g, ' ') : '';

    const summaryMatch = entryXml.match(/<summary>([\s\S]*?)<\/summary>/);
    const summary = summaryMatch ? summaryMatch[1].trim().replace(/\n\s+/g, ' ') : '';

    const publishedMatch = entryXml.match(/<published>(.*?)<\/published>/);
    const published = publishedMatch ? publishedMatch[1] : '';

    const updatedMatch = entryXml.match(/<updated>(.*?)<\/updated>/);
    const updated = updatedMatch ? updatedMatch[1] : '';

    const authorMatches = entryXml.match(/<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g);
    const authors = authorMatches 
      ? authorMatches.map(a => {
          const nameMatch = a.match(/<name>(.*?)<\/name>/);
          return { name: nameMatch ? nameMatch[1] : '' };
        })
      : [];

    const categoryMatches = entryXml.match(/<category term="(.*?)"\/>/g);
    const categories = categoryMatches
      ? categoryMatches.map(c => {
          const match = c.match(/term="(.*?)"/);
          return match ? match[1] : '';
        }).filter(Boolean)
      : [];

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

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0].message.content?.trim() || '';
  } catch (error) {
    console.error('Error generating AI explanation:', error);
    return 'No explanation available.';
  }
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

// Main daily import function
async function dailyImportPapers() {
  console.log('🔍 Daily Paper Import Starting...');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  
  // Read existing papers
  const papersPath = path.join(process.cwd(), 'data', 'papers.json');
  let existingPapers: any[] = [];
  
  try {
    const fileContent = fs.readFileSync(papersPath, 'utf-8');
    existingPapers = JSON.parse(fileContent);
    console.log(`📚 Found ${existingPapers.length} existing papers`);
  } catch (e) {
    console.log('📚 No existing papers found, starting fresh');
    existingPapers = [];
  }

  // Get existing arXiv IDs to avoid duplicates
  const existingIds = new Set(existingPapers.map((p: any) => p.arxivId));
  
  console.log('');
  console.log('🔍 Fetching latest papers from arXiv...');
  
  // Search for AI papers (fetch more to ensure we get new ones)
  const query = 'cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV';
  const entries = await fetchArxivPapers(query, 30);
  
  console.log(`✅ Found ${entries.length} papers from arXiv`);
  
  // Filter out papers we already have
  const newEntries = entries.filter(entry => !existingIds.has(entry.id));
  
  if (newEntries.length === 0) {
    console.log('');
    console.log('✅ No new papers to import!');
    return;
  }
  
  console.log(`📥 ${newEntries.length} new papers to import`);
  console.log('');
  
  console.log('🤖 Generating AI explanations...');
  const newPapers = [];
  
  for (const entry of newEntries) {
    const paper = await convertToPaper(entry);
    newPapers.push(paper);
    // Wait a bit to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('');
  console.log('💾 Updating papers.json...');
  
  // Add new papers at the beginning (most recent first)
  const updatedPapers = [...newPapers, ...existingPapers];
  
  fs.writeFileSync(papersPath, JSON.stringify(updatedPapers, null, 2), 'utf-8');
  
  console.log('');
  console.log(`✅ Successfully imported ${newPapers.length} new papers!`);
  console.log(`📊 Total papers: ${updatedPapers.length}`);
  console.log(`📁 Saved to: ${papersPath}`);
  console.log('');
  console.log('🎉 Daily import completed!');
}

// Run the daily import
dailyImportPapers().catch(console.error);
