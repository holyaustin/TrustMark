import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const faqs = [
  { q: 'What is TrustMark?', a: 'TrustMark is a digital trust badge that verifies a seller\'s phone number and business location using mobile network APIs.' },
  { q: 'How much does it cost?', a: 'We offer a free 7-day trial, then Pro plan at ₦2,500/month, and Business plan at ₦15,000/month.' },
  { q: 'How does verification work?', a: 'We use Nokia Network-as-Code APIs to silently verify your phone number and confirm your location.' },
  { q: 'What happens if someone swaps my SIM?', a: 'Our system detects SIM swaps within 24 hours and automatically suspends your badge to prevent fraud.' },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">Find answers to common questions about TrustMark.</p>
        
        <div className="space-y-4 mb-8">
          {faqs.map((faq, i) => (
            <Card key={i} className="p-6">
              <h3 className="font-semibold text-lg mb-2">❓ {faq.q}</h3>
              <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
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