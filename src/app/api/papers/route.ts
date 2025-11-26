import { NextResponse } from 'next/server';
import { getAllPapers } from '@/lib/papers';

export async function GET() {
  const papers = getAllPapers();
  return NextResponse.json(papers);
}
