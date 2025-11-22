import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, title, excerpt } = await request.json();

    // Generate search query based on post content
    let searchQuery = query;
    if (!searchQuery && (title || excerpt)) {
      // Extract key concepts from title and excerpt for image search
      const text = `${title || ''} ${excerpt || ''}`.toLowerCase();
      
      // Extract potential keywords (simplified AI logic)
      const keywords = text
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 4)
        .slice(0, 3)
        .join(' ');
      
      searchQuery = keywords || 'technology';
    }

    // Use Unsplash API for high-quality images
    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY || 'demo';
    
    // If no API key, return curated tech/AI images
    if (unsplashAccessKey === 'demo') {
      const demoImages = [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
          description: 'AI and technology abstract',
          author: 'Unsplash'
        },
        {
          id: '2',
          url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop',
          description: 'Neural network visualization',
          author: 'Unsplash'
        },
        {
          id: '3',
          url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
          description: 'Technology and innovation',
          author: 'Unsplash'
        },
        {
          id: '4',
          url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
          description: 'Digital technology',
          author: 'Unsplash'
        },
        {
          id: '5',
          url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=200&fit=crop',
          description: 'Data and analytics',
          author: 'Unsplash'
        },
        {
          id: '6',
          url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=400&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&h=200&fit=crop',
          description: 'Brain and AI concept',
          author: 'Unsplash'
        }
      ];
      
      return NextResponse.json({
        success: true,
        query: searchQuery,
        images: demoImages,
        message: 'Demo mode - Add UNSPLASH_ACCESS_KEY to .env.local for full functionality'
      });
    }

    // Call Unsplash API
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=12&orientation=landscape`;
    const response = await fetch(unsplashUrl, {
      headers: {
        'Authorization': `Client-ID ${unsplashAccessKey}`
      }
    });

    if (!response.ok) {
      throw new Error('Unsplash API request failed');
    }

    const data = await response.json();
    
    const images = data.results.map((photo: any) => ({
      id: photo.id,
      url: `${photo.urls.raw}&w=800&h=400&fit=crop`,
      thumbnail: photo.urls.small,
      description: photo.description || photo.alt_description || 'Unsplash image',
      author: photo.user.name
    }));

    return NextResponse.json({
      success: true,
      query: searchQuery,
      images
    });
  } catch (error) {
    console.error('Image search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
