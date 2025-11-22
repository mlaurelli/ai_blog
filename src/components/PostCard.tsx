import Link from 'next/link';
import { Post } from '@/lib/posts';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border-b border-gray-400 dark:border-gray-600 pb-8 mb-8 last:border-b-0 flex flex-col">
      <div className="flex items-baseline mb-3 text-xs">
        <span className="uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400 border-b border-gray-400 dark:border-gray-600 pb-0.5">
          {post.tags[0]}
        </span>
        <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
        <time className="text-gray-500 dark:text-gray-400 font-medium">
          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </time>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight" style={{ minHeight: '3.6rem' }}>
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>

      <Link href={`/blog/${post.slug}`} className="block mb-4 border border-gray-400 dark:border-gray-600">
        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>
      </Link>
      
      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-justify flex-grow">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <span className="text-xs text-gray-600 dark:text-gray-400 italic">
          By {post.author.name}
        </span>
        <Link 
          href={`/blog/${post.slug}`}
          className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}
