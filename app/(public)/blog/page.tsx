import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const posts = [
  { title: '5 Tips to Avoid Social Commerce Scams', date: 'April 1, 2026', excerpt: 'Learn how to spot fake sellers and protect your money...' },
  { title: 'Why SIM Swap Fraud Is Rising in Africa', date: 'March 25, 2026', excerpt: 'Understanding the threat and how TrustMark protects you...' },
  { title: 'The Future of Digital Identity for SMEs', date: 'March 18, 2026', excerpt: 'How network-based verification is changing e-commerce...' },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">TrustMark Blog</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Insights, tips, and news about social commerce and digital trust.</p>
        
        <div className="space-y-6 mb-8">
          {posts.map((post, i) => (
            <Card key={i} className="p-6">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{post.date}</p>
              <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
              <Link href="#" className="text-royal-600 hover:underline mt-2 inline-block">Read more →</Link>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}