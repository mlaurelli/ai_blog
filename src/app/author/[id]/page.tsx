'use client';

import { notFound } from 'next/navigation';
import { getAuthorById } from '@/lib/authors';
import { getAllPosts } from '@/lib/posts';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { Mail, Globe, Twitter, Linkedin, Github } from 'lucide-react';
import { use, useState, useEffect } from 'react';

export default function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { language } = useLanguage();
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  
  const author = getAuthorById(id);

  if (!author) {
    notFound();
  }

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

  // Get all posts by this author
  const allPosts = getAllPosts(language);
  const authorPosts = allPosts.filter(post => 
    post.author.name === author.name
  );

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
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 relative border-4 border-black dark:border-white">
                {author.avatar.startsWith('http') || author.avatar.startsWith('/uploads') ? (
                  <img 
                    src={`${author.avatar}${author.avatar.includes('?') ? '&' : '?'}cb=${cacheBuster}`}
                    alt={author.name}
                    className="w-full h-full object-cover"
                    key={`${author.avatar}-${cacheBuster}`}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-4xl font-bold text-gray-600 dark:text-gray-400">
                    {author.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight tracking-tight">
                {author.name}
              </h1>
              
              <p className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-6">
                {author.role}
              </p>

              <p className="text-lg leading-relaxed mb-6">
                {author.bio}
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4">
                {author.email && (
                  <a 
                    href={`mailto:${author.email}`}
                    className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm uppercase tracking-wide transition-colors"
                  >
                    Email
                  </a>
                )}
                {author.website && (
                  <a 
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm uppercase tracking-wide transition-colors"
                  >
                    Website
                  </a>
                )}
                {author.twitter && (
                  <a 
                    href={`https://twitter.com/${author.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm uppercase tracking-wide transition-colors"
                  >
                    Twitter
                  </a>
                )}
                {author.linkedin && (
                  <a 
                    href={`https://linkedin.com/in/${author.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm uppercase tracking-wide transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {author.github && (
                  <a 
                    href={`https://github.com/${author.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm uppercase tracking-wide transition-colors"
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
            <h2 className="text-3xl font-black mb-8 tracking-tight">
              Articles by {author.name.split(' ')[0]} ({authorPosts.length})
            </h2>
            
            <div className="space-y-8">
              {authorPosts.map((post) => (
                <article key={post.slug} className="border-b-2 border-gray-300 dark:border-gray-700 pb-8 last:border-b-0">
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="flex gap-6">
                      {/* Thumbnail */}
                      {post.coverImage && (
                        <div className="w-48 h-32 flex-shrink-0 border-2 border-gray-400 group-hover:border-black dark:group-hover:border-white transition-colors overflow-hidden">
                          <img 
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
                        
                        <h3 className="text-2xl font-black mb-3 group-hover:underline leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-xs font-semibold uppercase tracking-wide"
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
