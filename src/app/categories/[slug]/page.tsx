import { notFound } from 'next/navigation';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { getCategoryBySlug } from '@/lib/seo';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }

  const posts = getAllPosts();
  
  // Filter posts by category (matching tags with category keywords)
  const categoryPosts = posts.filter(post => {
    const categoryKeywords = category.name.toLowerCase().split(/[\s&]+/);
    return post.tags.some(tag => 
      categoryKeywords.some(keyword => 
        tag.toLowerCase().includes(keyword) || keyword.includes(tag.toLowerCase())
      )
    );
  });

  return (
    <Layout title={`${category.name} | AI Blog - by Michele Laurelli`}>
      <div className="max-w-4xl mx-auto">
        {/* Category Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Link 
              href="/categories"
              className="text-xs uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-b border-gray-400 dark:border-gray-600 pb-1 inline-block"
            >
              ← All Categories
            </Link>
          </div>
          
          {/* Category Image */}
          <div className="mb-6 border-2 border-gray-400 dark:border-gray-600 overflow-hidden">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-64 object-cover"
            />
          </div>
          
          <div className="pb-6 border-b-2 border-black dark:border-gray-600">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
              {category.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {category.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">
                {categoryPosts.length} {categoryPosts.length === 1 ? 'Article' : 'Articles'}
              </span>
              <span>•</span>
              <span>Updated regularly</span>
            </div>
          </div>
        </div>

        {/* Posts in Category */}
        {categoryPosts.length > 0 ? (
          <div className="space-y-8">
            {categoryPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No Articles Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Articles in this category are coming soon.
            </p>
            <Link
              href="/categories"
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 font-bold uppercase tracking-wide hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Browse Other Categories
            </Link>
          </div>
        )}

        {/* Related Tags */}
        {categoryPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-gray-400 dark:border-gray-600">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Tags in this category
            </h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(categoryPosts.flatMap(post => post.tags)))
                .sort()
                .map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 px-3 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
