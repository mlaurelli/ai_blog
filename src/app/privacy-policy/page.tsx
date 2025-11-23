import Layout from '@/components/Layout';
import PrivacyPolicyContent from './PrivacyPolicyContent';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy and data protection information for AI Blog',
};

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <PrivacyPolicyContent />
    </Layout>
  );
}
