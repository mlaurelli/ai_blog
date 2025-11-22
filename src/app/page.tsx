'use client';

import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { language } = useLanguage();
  const posts = getAllPosts(language);

  return (
    <Layout>
      {/* Two-column layout for articles */}
      <div className="grid md:grid-cols-2 gap-0">
        <div className="md:pr-12 md:border-r md:border-gray-400 dark:md:border-gray-600">
          {posts.filter((_, i) => i % 2 === 0).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="md:pl-12">
          {posts.filter((_, i) => i % 2 === 1).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
