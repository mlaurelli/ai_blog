import { getAllTerms, getAllCategories } from '@/lib/glossary';
import GlossaryClient from '@/components/GlossaryClient';

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export default function GlossaryPage() {
  // Get terms on the server
  const termsEn = getAllTerms('en');
  const termsIt = getAllTerms('it');
  const categoriesEn = getAllCategories('en');
  const categoriesIt = getAllCategories('it');

  return (
    <GlossaryClient
      termsEn={termsEn}
      termsIt={termsIt}
      categoriesEn={categoriesEn}
      categoriesIt={categoriesIt}
    />
  );
}
