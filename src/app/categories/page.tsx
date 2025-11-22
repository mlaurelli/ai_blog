import Layout from '@/components/Layout';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { getAllCategories } from '@/lib/seo';

export default function CategoriesPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  // Count posts per category (based on tags for now)
  const categoryCounts = categories.map(category => {
    const count = posts.filter(post => 
      post.tags.some(tag => 
        tag.toLowerCase().includes(category.name.toLowerCase().split(' ')[0]) ||
        category.name.toLowerCase().includes(tag.toLowerCase())
      )
    ).length;
    return { ...category, count };
  });

  return (
    <Layout title="Categories | AI Blog - by Michele Laurelli">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pb-6 border-b-2 border-black dark:border-gray-600">
          <span className="text-xs uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-400 dark:border-gray-600 pb-1 inline-block mb-4">
            Content Pillars
          </span>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">Categories</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">AI insights organized by technical domain and perspective</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {categoryCounts.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="block border-2 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white transition-all overflow-hidden group"
            >
              {/* Category Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-black dark:bg-white text-white dark:text-black text-sm font-bold px-3 py-1">
                  {category.count} {category.count === 1 ? 'Article' : 'Articles'}
                </div>
              </div>
              
              {/* Category Info */}
              <div className="p-6 bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {category.name}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {category.description}
                </p>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  View Articles →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Tags Section */}
        <div className="border-t-2 border-gray-400 dark:border-gray-600 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">All Tags</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(posts.flatMap(post => post.tags))).sort().map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 px-3 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
