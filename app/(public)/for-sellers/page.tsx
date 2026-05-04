import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { TrendingUp, Shield, Users, DollarSign, CheckCircle } from 'lucide-react';

export default function ForSellersPage() {
  const benefits = [
    { icon: TrendingUp, title: 'Increase Sales', description: 'Build buyer trust and close more deals.' },
    { icon: Shield, title: 'Prevent Fraud', description: 'SIM swap monitoring protects your account.' },
    { icon: Users, title: 'Build Reputation', description: 'Show buyers you\'re legitimate.' },
    { icon: DollarSign, title: 'Reduce Chargebacks', description: 'Verified sellers have fewer disputes.' },
  ];

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">For Sellers</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Get verified and start building trust with buyers today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {benefits.map((benefit, i) => (
            <Card key={i} className="p-6 flex items-start gap-4">
              <benefit.icon className="w-8 h-8 text-royal-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/get-verified">
            <Button variant="primary" size="lg">Get Verified Now →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}