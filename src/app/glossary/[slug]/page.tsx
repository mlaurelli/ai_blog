import { getTermBySlug, getAllTerms } from '@/lib/glossary';
import GlossaryTermClient from '@/components/GlossaryTermClient';
import { notFound } from 'next/navigation';

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;
// Allow dynamic params for new terms
export const dynamicParams = true;

export default async function GlossaryTermPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Get terms on the server for both languages
  const termEn = getTermBySlug(slug, 'en');
  const termIt = getTermBySlug(slug, 'it');
  
  // If no term exists in either language, show 404
  if (!termEn && !termIt) {
    notFound();
  }
  
  // Get all terms for related terms
  const allTermsEn = getAllTerms('en');
  const allTermsIt = getAllTerms('it');
  
  // Get related terms for both languages
  const relatedTermsEn = termEn?.relatedTerms
    ?.map(relSlug => allTermsEn.find(t => t.slug === relSlug))
    .filter(Boolean) || [];
    
  const relatedTermsIt = termIt?.relatedTerms
    ?.map(relSlug => allTermsIt.find(t => t.slug === relSlug))
    .filter(Boolean) || [];

  return (
    <GlossaryTermClient
      termEn={termEn || null}
      termIt={termIt || null}
      relatedTermsEn={relatedTermsEn as any}
      relatedTermsIt={relatedTermsIt as any}
    />
  );
}
