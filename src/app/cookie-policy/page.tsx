import Layout from '@/components/Layout';
import CookiePolicyContent from './CookiePolicyContent';

export const metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy and tracking information for AI Blog',
};

export default function CookiePolicyPage() {
  return (
    <Layout>
      <CookiePolicyContent />
    </Layout>
  );
}
