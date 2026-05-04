import Card from '@/components/ui/Card';
import { Phone, MapPin, Shield, QrCode, Bell, CheckCircle } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    { icon: Phone, title: 'Verify Your Phone', description: 'Enter your phone number. We silently confirm it\'s active using network APIs.' },
    { icon: MapPin, title: 'Confirm Location', description: 'Share your current location to prove you\'re at your business address.' },
    { icon: Shield, title: 'Get Verified', description: 'Receive your TrustMark badge with QR code and short link.' },
    { icon: QrCode, title: 'Share Your Badge', description: 'Add to WhatsApp, Instagram, or any social platform.' },
    { icon: Bell, title: 'Continuous Monitoring', description: '24/7 SIM swap monitoring protects your account.' },
  ];

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How TrustMark Works</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Simple, secure, and network-verified identity for social commerce sellers across Africa</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="w-16 h-16 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-royal-600 dark:text-royal-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Step {i+1}: {step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}