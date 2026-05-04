import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const articles = [
  { title: 'TrustMark Launches to Combat Social Commerce Fraud in Africa', date: 'March 15, 2026', source: 'TechCrunch Africa' },
  { title: 'How Network APIs Are Revolutionizing Seller Verification', date: 'March 10, 2026', source: 'Mobile World Live' },
  { title: 'TrustMark Raises $2M Seed Funding', date: 'February 28, 2026', source: 'Disrupt Africa' },
];

export default function PressPage() {
  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Press & News</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Latest news and updates from TrustMark.</p>
        
        <div className="space-y-4 mb-8">
          {articles.map((article, i) => (
            <Card key={i} className="p-4">
              <h3 className="font-semibold text-royal-600">{article.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{article.source} • {article.date}</p>
            </Card>
          ))}
        </div>
        
        <div className="bg-royal-50 dark:bg-royal-900/30 p-6 rounded-lg text-center mb-8">
          <h3 className="font-semibold mb-2">Media Contact</h3>
          <p className="text-gray-600">media@trustmark.africa</p>
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