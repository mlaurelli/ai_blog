'use client';

import { notFound } from 'next/navigation';
import type { Author } from '@/lib/authors';
import type { Post } from '@/lib/posts';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import AuthorAvatar from '@/components/AuthorAvatar';
import PostThumbnail from '@/components/PostThumbnail';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { Mail, Globe, Twitter, Linkedin, Github } from 'lucide-react';
import { use, useState, useEffect } from 'react';

export default function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { language } = useLanguage();
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch author and posts data from API
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch authors
        const authorsResponse = await fetch('/api/authors');
        if (authorsResponse.ok) {
          const authors: Author[] = await authorsResponse.json();
          const foundAuthor = authors.find(a => a.id === id);
          setAuthor(foundAuthor || null);
        }
        
        // Fetch posts
        const postsResponse = await fetch('/api/posts');
        if (postsResponse.ok) {
          const allPosts: Post[] = await postsResponse.json();
          setPosts(allPosts);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setAuthor(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Refresh cache buster when page becomes visible (after editing author)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setCacheBuster(Date.now());
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="max-w-4xl mx-auto py-16 text-center">
          <p className="text-xl">Loading author...</p>
        </div>
      </Layout>
    );
  }

  if (!author) {
    notFound();
  }

  // Filter posts by this author and deduplicate by slug
  const authorPosts = posts
    .filter(post => post.author.name.trim() === author.name.trim())
    .reduce((acc, post) => {
      // Keep only one version per slug (prefer current language, fallback to 'en')
      const existing = acc.find(p => p.slug === post.slug);
      if (!existing) {
        acc.push(post);
      } else if (post.language === language || (post.language === 'both' && existing.language !== language)) {
        // Replace if current post is in preferred language
        const index = acc.findIndex(p => p.slug === post.slug);
        acc[index] = post;
      }
      return acc;
    }, [] as Post[]);

  return (
    <Layout title={author.seo.title}>
      <article className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/"
            className="text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-b-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white pb-1 inline-block transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>

        {/* Author Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <AuthorAvatar 
              name={author.name}
              avatar={author.avatar}
              size="xl"
              shape="square"
            />

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight tracking-tight text-gray-900 dark:text-white">
                {author.name}
              </h1>
              
              <p className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-6">
                {author.role}
              </p>

              <p className="text-lg leading-relaxed mb-6 text-gray-900 dark:text-gray-100">
                {author.bio}
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4">
                {author.email && (
                  <a 
                    href={`mailto:${author.email}`}
                    className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm uppercase tracking-wide transition-colors text-gray-900 dark:text-gray-100"
                  >
                    Email
                  </a>
                )}
                {author.website && (
                  <a 
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm uppercase tracking-wide transition-colors text-gray-900 dark:text-gray-100"
                  >
                    Website
                  </a>
                )}
                {author.twitter && (
                  <a 
                    href={`https://twitter.com/${author.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm uppercase tracking-wide transition-colors text-gray-900 dark:text-gray-100"
                  >
                    Twitter
                  </a>
                )}
                {author.linkedin && (
                  <a 
                    href={`https://linkedin.com/in/${author.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm uppercase tracking-wide transition-colors text-gray-900 dark:text-gray-100"
                  >
                    LinkedIn
                  </a>
                )}
                {author.github && (
                  <a 
                    href={`https://github.com/${author.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm uppercase tracking-wide transition-colors text-gray-900 dark:text-gray-100"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Articles Section */}
        {authorPosts.length > 0 && (
          <section>
            <div className="space-y-8">
              {authorPosts.map((post) => (
                <article key={post.slug} className="border-b-2 border-gray-300 dark:border-gray-700 pb-8 last:border-b-0">
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="flex gap-6">
                      {/* Thumbnail */}
                      {post.coverImage && (
                        <div className="w-48 h-32 flex-shrink-0 border-2 border-gray-400 group-hover:border-black dark:group-hover:border-white transition-colors overflow-hidden">
                          <PostThumbnail 
                            src={post.coverImage} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-2">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        
                        <h3 className="text-2xl font-black mb-3 group-hover:underline leading-tight text-gray-900 dark:text-white">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-xs font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}
