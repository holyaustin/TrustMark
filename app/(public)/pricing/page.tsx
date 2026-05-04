import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Check, Shield, Bell, QrCode, Users } from 'lucide-react';

const plans = [
  { name: 'Free', price: '₦0', period: '7 days', features: ['Number verification', 'Basic badge', '7-day validity'] },
  { name: 'Pro', price: '₦2,500', period: 'month', features: ['Number + Location verification', 'Continuous SIM monitoring', 'Unlimited shares', 'Trust score', 'Priority support'] },
  { name: 'Business', price: '₦15,000', period: 'month', features: ['All Pro features', 'API access', 'Bulk verifications', 'Dedicated support', 'Custom branding'] },
];

export default function PricingPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Choose the plan that fits your business needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <Card key={i} className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-royal-600 mb-2">{plan.price}</p>
              <p className="text-sm text-gray-500 mb-4">per {plan.period}</p>
              <ul className="space-y-2 text-sm text-left mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2"><Check size={16} className="text-green-500" />{feature}</li>
                ))}
              </ul>
              <Link href="/get-verified"><Button variant="primary" className="w-full">Get Started</Button></Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}