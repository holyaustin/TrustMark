import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Shield, Search, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ForBuyersPage() {
  const tips = [
    { icon: Search, title: 'Always Verify', description: 'Check TrustMark before sending money to any seller.' },
    { icon: Shield, title: 'Check SIM Status', description: 'Ensure no recent SIM swap on seller\'s account.' },
    { icon: AlertTriangle, title: 'Report Suspicious', description: 'Help the community by reporting fraud.' },
  ];

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">For Buyers</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Shop with confidence. Always verify before you pay.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tips.map((tip, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <tip.icon className="w-6 h-6 text-royal-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{tip.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/verify">
            <Button variant="primary" size="lg">Verify a Seller →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}