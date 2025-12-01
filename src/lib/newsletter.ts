import fs from 'fs';
import path from 'path';

export type Newsletter = {
  id: string;
  subject: string;
  introduction: string;
  language?: 'en' | 'it';
  selectedPosts: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
  }[];
  sentDate: string;
  recipient_count?: number;
  mailchimp_campaign_id?: string;
  status: 'draft' | 'sent';
};

const NEWSLETTERS_FILE = path.join(process.cwd(), 'data', 'newsletters.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Get all newsletters
export function getAllNewsletters(): Newsletter[] {
  ensureDataDirectory();
  if (!fs.existsSync(NEWSLETTERS_FILE)) {
    fs.writeFileSync(NEWSLETTERS_FILE, JSON.stringify([], null, 2));
    return [];
  }
  const data = fs.readFileSync(NEWSLETTERS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Get newsletter by ID
export function getNewsletterById(id: string): Newsletter | null {
  const newsletters = getAllNewsletters();
  return newsletters.find(n => n.id === id) || null;
}

// Save newsletter
export function saveNewsletter(newsletter: Newsletter): void {
  ensureDataDirectory();
  const newsletters = getAllNewsletters();
  const existingIndex = newsletters.findIndex(n => n.id === newsletter.id);
  
  if (existingIndex >= 0) {
    newsletters[existingIndex] = newsletter;
  } else {
    newsletters.push(newsletter);
  }
  
  // Sort by date (most recent first)
  newsletters.sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime());
  
  fs.writeFileSync(NEWSLETTERS_FILE, JSON.stringify(newsletters, null, 2));
}

// Delete newsletter
export function deleteNewsletter(id: string): boolean {
  const newsletters = getAllNewsletters();
  const filtered = newsletters.filter(n => n.id !== id);
  
  if (filtered.length === newsletters.length) {
    return false;
  }
  
  fs.writeFileSync(NEWSLETTERS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

// Generate newsletter HTML template
export function generateNewsletterHTML(newsletter: Newsletter): string {
  const lang = newsletter.language || 'en';
  const locale = lang === 'it' ? 'it-IT' : 'en-US';
  
  const today = new Date().toLocaleDateString(locale, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const translations = {
    en: {
      by: 'by',
      readMore: 'Read Full Article →',
      tagline: 'Artificial intelligence treated with scientific integrity,<br>engineering precision, and human depth.',
      visit: 'Visit Website',
      receiving: "You're receiving this because you subscribed to AI Blog newsletter.",
      unsubscribe: 'Unsubscribe',
      updatePrefs: 'Update Preferences'
    },
    it: {
      by: 'di',
      readMore: 'Leggi Articolo Completo →',
      tagline: "L'intelligenza artificiale trattata con rigore scientifico,<br>precisione ingegneristica e profondità umana.",
      visit: 'Visita il Sito',
      receiving: 'Ricevi questa email perché sei iscritto alla newsletter di AI Blog.',
      unsubscribe: 'Cancella Iscrizione',
      updatePrefs: 'Aggiorna Preferenze'
    }
  };
  
  const t = translations[lang];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletter.subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Georgia, 'Times New Roman', serif;
      background-color: #f5f5f0;
      color: #1a1a1a;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    .header {
      border-bottom: 4px solid #000000;
      padding: 20px;
      text-align: center;
    }
    
    .header-date {
      font-size: 11px;
      color: #666666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 10px;
    }
    
    .masthead {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 48px;
      font-weight: 900;
      margin: 20px 0 10px 0;
      letter-spacing: -1px;
      line-height: 1;
    }
    
    .tagline {
      font-size: 12px;
      font-style: italic;
      color: #666666;
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      padding: 8px 0;
      display: inline-block;
    }
    
    .intro {
      padding: 30px 20px;
      border-bottom: 2px solid #e0e0e0;
      line-height: 1.8;
      font-size: 16px;
    }
    
    .intro p {
      margin: 0 0 15px 0;
    }
    
    .articles {
      padding: 20px;
    }
    
    .article {
      margin-bottom: 35px;
      padding-bottom: 35px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .article:last-child {
      border-bottom: none;
    }
    
    .article-title {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 10px 0;
      line-height: 1.3;
    }
    
    .article-title a {
      color: #000000;
      text-decoration: none;
    }
    
    .article-title a:hover {
      text-decoration: underline;
    }
    
    .article-meta {
      font-size: 12px;
      color: #666666;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .article-excerpt {
      font-size: 15px;
      line-height: 1.7;
      color: #333333;
      margin: 0 0 15px 0;
    }
    
    .read-more {
      display: inline-block;
      padding: 10px 20px;
      background-color: #000000 !important;
      color: #ffffff !important;
      text-decoration: none !important;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: 2px solid #000000;
    }
    
    .read-more:visited {
      color: #ffffff !important;
    }
    
    .read-more:hover {
      background-color: #333333 !important;
      color: #ffffff !important;
    }
    
    .footer {
      background-color: #1a1a1a;
      padding: 40px 20px 30px;
      text-align: center;
      border-top: 4px solid #000000;
      color: #ffffff;
    }
    
    .footer-brand {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 32px;
      font-weight: 900;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    
    .footer-tagline {
      font-size: 13px;
      line-height: 1.6;
      color: #cccccc;
      margin: 0 0 25px 0;
      padding: 0 20px;
    }
    
    .footer-divider {
      width: 60px;
      height: 2px;
      background-color: #ffffff;
      margin: 25px auto;
    }
    
    .footer-social {
      margin: 25px 0;
    }
    
    .footer-social a {
      display: inline-block;
      margin: 0 12px;
      padding: 8px 16px;
      color: #ffffff !important;
      text-decoration: none !important;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: 2px solid #ffffff;
    }
    
    .footer-social a:visited {
      color: #ffffff !important;
    }
    
    .footer-social a:hover {
      background-color: #ffffff;
      color: #000000 !important;
    }
    
    .footer-website {
      margin: 20px 0;
    }
    
    .footer-website a {
      color: #ffffff !important;
      text-decoration: none !important;
      font-size: 13px;
      border-bottom: 1px solid #ffffff;
      padding-bottom: 2px;
    }
    
    .footer-website a:visited {
      color: #ffffff !important;
    }
    
    .unsubscribe {
      margin-top: 30px;
      padding-top: 25px;
      border-top: 1px solid #444444;
      font-size: 11px;
      color: #999999;
      line-height: 1.8;
    }
    
    .unsubscribe a {
      color: #cccccc !important;
      text-decoration: underline !important;
    }
    
    .unsubscribe a:visited {
      color: #cccccc !important;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-date">${today}</div>
      <h1 class="masthead">AI Blog</h1>
      <p class="tagline">by Michele Laurelli</p>
    </div>
    
    <!-- Introduction -->
    <div class="intro">
      ${newsletter.introduction.split('\n').map(p => `<p>${p}</p>`).join('')}
    </div>
    
    <!-- Articles -->
    <div class="articles">
      ${newsletter.selectedPosts.map(post => `
        <div class="article">
          <h2 class="article-title">
            <a href="https://ai-blog.it/blog/${post.slug}">${post.title}</a>
          </h2>
          <div class="article-meta">
            ${new Date(post.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })} · ${t.by} ${post.author}
          </div>
          <p class="article-excerpt">${post.excerpt}</p>
          <a href="https://ai-blog.it/blog/${post.slug}" class="read-more">${t.readMore}</a>
        </div>
      `).join('')}
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-brand">AI Blog</div>
      <p class="footer-tagline">${t.tagline}</p>
      
      <div class="footer-divider"></div>
      
      <div class="footer-social">
        <a href="https://linkedin.com/in/michelelaurelli">LinkedIn</a>
      </div>
      
      <div class="footer-website">
        <a href="https://ai-blog.it">${t.visit}</a>
      </div>
      
      <div class="unsubscribe">
        <p>${t.receiving}</p>
        <p><a href="*|UNSUB|*">${t.unsubscribe}</a> | <a href="*|UPDATE_PROFILE|*">${t.updatePrefs}</a></p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
