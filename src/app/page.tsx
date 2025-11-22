import { getAllPosts } from '@/lib/posts';
import HomeClient from '@/components/HomeClient';

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export default function Home() {
  // Get posts on the server
  const postsEn = getAllPosts('en');
  const postsIt = getAllPosts('it');

  return <HomeClient postsEn={postsEn} postsIt={postsIt} />;
}
