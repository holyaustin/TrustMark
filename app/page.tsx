'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import NumberVerificationForm from '@/components/verification/NumberVerificationForm';
import LocationVerificationForm from '@/components/verification/LocationVerificationForm';
import VerificationSuccess from '@/components/verification/VerificationSuccess';
import { Shield, QrCode, Clock, Users } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<'register' | 'number' | 'location' | 'success'>('register');
  const [userId, setUserId] = useState<string | null>(null);

  if (user && user.badgeActive) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-50 to-white dark:from-royal-950 dark:to-black py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-royal-800 dark:text-royal-400 mb-4">
            TrustMark
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            The digital trust badge that proves you're a legitimate seller. 
            Stop scammers. Build buyer confidence. Grow your business.
          </p>
          <Button variant="primary" size="lg" onClick={() => setStep('number')}>
            Get Verified Now → 
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <Shield className="w-12 h-12 text-royal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Network Verified</h3>
              <p className="text-gray-600 dark:text-gray-400">We use mobile network APIs to verify your phone and location.</p>
            </Card>
            <Card className="p-6 text-center">
              <QrCode className="w-12 h-12 text-royal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Share Your Badge</h3>
              <p className="text-gray-600 dark:text-gray-400">Get a QR code and short link to share on WhatsApp, Instagram, and more.</p>
            </Card>
            <Card className="p-6 text-center">
              <Clock className="w-12 h-12 text-royal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-400">We monitor for SIM swaps and auto-suspend badges if fraud is detected.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Badge Preview */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-8">See What Buyers See</h2>
          <div className="max-w-md mx-auto">
            <Card className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Mama Blessing's Fashion</h3>
                <p className="text-gray-600">TrustMark Verified Seller</p>
                <div className="mt-4 text-left space-y-2 text-sm">
                  <p>✓ Phone verified: Yes</p>
                  <p>✓ Location verified: Yes</p>
                  <p>✓ No recent SIM swap</p>
                  <p>✓ Verified since Jan 15, 2024</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Verification Flow */}
      <div className="container-custom py-16 max-w-md">
        {step === 'number' && (
          <NumberVerificationForm onSuccess={(id) => { setUserId(id); setStep('location'); }} />
        )}
        {step === 'location' && userId && (
          <LocationVerificationForm userId={userId} onSuccess={() => setStep('success')} />
        )}
        {step === 'success' && (
          <VerificationSuccess />
        )}
      </div>
    </div>
  );
}