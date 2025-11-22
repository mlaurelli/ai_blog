import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ success: true, files: [] });
    }

    const files = await readdir(uploadsDir);
    
    const fileDetails = await Promise.all(
      files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map(async (file) => {
          const filePath = path.join(uploadsDir, file);
          const stats = await stat(filePath);
          
          return {
            filename: file,
            url: `/uploads/${file}`,
            size: stats.size,
            uploadedAt: stats.birthtime,
            type: path.extname(file).toLowerCase()
          };
        })
    );

    // Sort by upload date (newest first)
    fileDetails.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

    return NextResponse.json({
      success: true,
      files: fileDetails
    });
  } catch (error) {
    console.error('List media error:', error);
    return NextResponse.json({ error: 'Failed to list media' }, { status: 500 });
  }
}
