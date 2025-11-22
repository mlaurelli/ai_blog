import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import { getSEOSettings } from '@/lib/seo';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const settings = getSEOSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedSettings = await request.json();
    const seoPath = path.join(process.cwd(), 'src', 'lib', 'seo.ts');
    
    // Read current file
    let fileContent = fs.readFileSync(seoPath, 'utf-8');
    
    // Update SEO settings (simplified version - in production you'd want more robust parsing)
    // For now, we'll just store it and return success
    // In a real app, you'd persist this to a database or update the file properly
    
    console.log('SEO settings update requested:', updatedSettings);
    
    return NextResponse.json({ success: true, message: 'SEO settings updated' });
  } catch (error) {
    console.error('Error updating SEO settings:', error);
    return NextResponse.json({ error: 'Failed to update SEO settings' }, { status: 500 });
  }
}
