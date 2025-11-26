import { NextResponse } from 'next/server';
import { getAllPressItems } from '@/lib/press';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const pressItems = getAllPressItems();
  return NextResponse.json(pressItems);
}

// Extract metadata from URL
async function extractMetadata(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PressBot/1.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }

    const html = await response.text();
    
    // Extract Open Graph and meta tags
    const metadata: any = {
      url,
      title: '',
      description: '',
      image: '',
      siteName: '',
      publishedDate: new Date().toISOString(),
    };

    // Extract title
    const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                      html.match(/<meta\s+name="twitter:title"\s+content="([^"]+)"/i) ||
                      html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) metadata.title = titleMatch[1].trim();

    // Extract description
    const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
                     html.match(/<meta\s+name="twitter:description"\s+content="([^"]+)"/i) ||
                     html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    if (descMatch) metadata.description = descMatch[1].trim();

    // Extract image
    const imgMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
                    html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i);
    if (imgMatch) {
      let imageUrl = imgMatch[1].trim();
      // Handle relative URLs
      if (imageUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
      }
      metadata.image = imageUrl;
    }

    // Extract site name
    const siteMatch = html.match(/<meta\s+property="og:site_name"\s+content="([^"]+)"/i);
    if (siteMatch) {
      metadata.siteName = siteMatch[1].trim();
    } else {
      // Fallback to domain name
      const urlObj = new URL(url);
      metadata.siteName = urlObj.hostname.replace('www.', '');
    }

    // Try to extract published date
    const dateMatch = html.match(/<meta\s+property="article:published_time"\s+content="([^"]+)"/i) ||
                     html.match(/<meta\s+name="date"\s+content="([^"]+)"/i) ||
                     html.match(/<time\s+datetime="([^"]+)"/i);
    if (dateMatch) {
      try {
        metadata.publishedDate = new Date(dateMatch[1]).toISOString();
      } catch (e) {
        // Keep default date if parsing fails
      }
    }

    return metadata;
  } catch (error) {
    console.error('Error extracting metadata:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Extract metadata from URL
    console.log('Extracting metadata from:', url);
    const metadata = await extractMetadata(url);
    
    // Read current press items from JSON
    const pressPath = path.join(process.cwd(), 'data', 'press.json');
    let pressItems = [];
    
    try {
      const fileContent = fs.readFileSync(pressPath, 'utf-8');
      pressItems = JSON.parse(fileContent);
    } catch (e) {
      pressItems = [];
    }

    // Create new press item
    const newItem = {
      id: `press-${Date.now()}`,
      ...metadata,
      addedDate: new Date().toISOString(),
    };

    // Add to beginning of array
    pressItems.unshift(newItem);

    // Write back to JSON file
    fs.writeFileSync(pressPath, JSON.stringify(pressItems, null, 2), 'utf-8');

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error('Error creating press item:', error);
    return NextResponse.json({ 
      error: 'Failed to create press item', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Read current press items from JSON
    const pressPath = path.join(process.cwd(), 'data', 'press.json');
    let pressItems = [];
    
    try {
      const fileContent = fs.readFileSync(pressPath, 'utf-8');
      pressItems = JSON.parse(fileContent);
    } catch (e) {
      return NextResponse.json({ error: 'Error reading press items' }, { status: 500 });
    }

    // Find and remove the item
    const itemIndex = pressItems.findIndex((item: any) => item.id === id);
    
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    pressItems.splice(itemIndex, 1);
    
    // Write back to JSON file
    fs.writeFileSync(pressPath, JSON.stringify(pressItems, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting press item:', error);
    return NextResponse.json({ error: 'Failed to delete press item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedItem = await request.json();
    
    if (!updatedItem.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Read current press items from JSON
    const pressPath = path.join(process.cwd(), 'data', 'press.json');
    let pressItems = [];
    
    try {
      const fileContent = fs.readFileSync(pressPath, 'utf-8');
      pressItems = JSON.parse(fileContent);
    } catch (e) {
      return NextResponse.json({ error: 'Error reading press items' }, { status: 500 });
    }

    // Find and update the item
    const itemIndex = pressItems.findIndex((item: any) => item.id === updatedItem.id);
    
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    pressItems[itemIndex] = updatedItem;
    
    // Write back to JSON file
    fs.writeFileSync(pressPath, JSON.stringify(pressItems, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating press item:', error);
    return NextResponse.json({ error: 'Failed to update press item' }, { status: 500 });
  }
}
