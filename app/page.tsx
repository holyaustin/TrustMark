'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import NumberVerificationForm from '@/components/verification/NumberVerificationForm';
import LocationVerificationForm from '@/components/verification/LocationVerificationForm';
import VerificationSuccess from '@/components/verification/VerificationSuccess';
import { Shield, QrCode, Clock, CheckCircle, Users, Globe, TrendingUp, Award } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<'register' | 'number' | 'location' | 'success'>('register');
  const [userId, setUserId] = useState<string | null>(null);

  if (user && user.badgeActive) {
    router.push('/dashboard');
    return null;
  }

  const closeModal = () => setStep('register');

  return (
    <div className="section-spacing">
      {/* Hero Section - Updated without "Africa" text */}
      <section className="container-custom mb-16 md:mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-royal-900/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4 text-royal-600 dark:text-royal-300" />
            <span className="text-sm font-medium text-royal-700 dark:text-royal-300">TrustMark Verified</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-royal-900 dark:text-white mb-4">
            Trust in Social Commerce
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
            The digital trust badge that proves you're a legitimate seller. 
            Stop scammers. Build buyer confidence. Grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" onClick={() => setStep('number')} className="shadow-xl bg-royal-600 hover:bg-royal-700">
              Get Your Badge → <span className="text-sm ml-1">(For Sellers)</span>
            </Button>
            <Link href="/verify">
              <Button variant="outline" size="lg" className="shadow-xl">
                Verify a Seller → <span className="text-sm ml-1">(For Buyers)</span>
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-royal-500" />
              <span>10,000+ Sellers</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-royal-500" />
              <span>500,000+ Verifications</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-royal-500" />
              <span>98% Fraud Reduction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the page remains the same */}
      {/* Trust Badge Preview */}
      <section className="container-custom mb-16 md:mb-24" id="how-it-works">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            What Buyers See
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A clear, trustworthy verification page that builds instant confidence
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <Card className="card-padding shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mama Blessing's Fashion</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">TrustMark Verified Seller</p>
              <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-left space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Phone verified: Yes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Location verified: Yes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No recent SIM swap detected</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Verified since January 2026</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/40 dark:bg-black/30 py-12 md:py-16">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              TrustMark Platform
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Empowering sellers and protecting buyers
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <p className="text-3xl md:text-4xl font-bold text-royal-600 dark:text-royal-400">10,000+</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Verified Sellers</p>
            </div>
            <div className="p-6">
              <p className="text-3xl md:text-4xl font-bold text-royal-600 dark:text-royal-400">500K+</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Buyer Verifications</p>
            </div>
            <div className="p-6">
              <p className="text-3xl md:text-4xl font-bold text-royal-600 dark:text-royal-400">98%</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Fraud Reduction</p>
            </div>
            <div className="p-6">
              <p className="text-3xl md:text-4xl font-bold text-royal-600 dark:text-royal-400">24/7</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">SIM Monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container-custom py-12 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Why Choose TrustMark?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Network-verified identity that protects both buyers and sellers
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <Card className="card-padding text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Network Verified</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We use mobile network APIs (CAMARA) to verify your phone number and business location.
            </p>
          </Card>
          <Card className="card-padding text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Instant Share</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get a QR code and short link to share on WhatsApp, Instagram, Facebook, or any platform.
            </p>
          </Card>
          <Card className="card-padding text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">24/7 Monitoring</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Continuous SIM swap monitoring. Badge auto-suspends if fraud is detected.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom pb-12 md:pb-16">
        <Card className="card-padding text-center bg-gradient-to-r from-royal-600 to-royal-800 dark:from-royal-700 dark:to-royal-900">
          <h2 className="text-2xl md:text-3xl font-bold text-royal-600 mb-3">
            Ready to Build Trust?
          </h2>
          <p className="text-royal-100 mb-6 max-w-md mx-auto">
            Join thousands of verified sellers who are growing their business with TrustMark.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => setStep('number')}
              className="bg-white text-royal-700 hover:bg-gray-100 shadow-xl"
            >
              Get Your Badge →
            </Button>
            <Link href="/verify">
              <Button variant="outline" size="lg" className="bg-royal-600 text-black border-royal-900 hover:bg-blue/10 shadow-xl">
                Verify a Seller →
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Verification Modal */}
      {step !== 'register' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            {step === 'number' && (
              <NumberVerificationForm onSuccess={(id) => { setUserId(id); setStep('location'); }} onClose={closeModal} />
            )}
            {step === 'location' && userId && (
              <LocationVerificationForm userId={userId} onSuccess={() => setStep('success')} onClose={closeModal} />
            )}
            {step === 'success' && (
              <VerificationSuccess onClose={closeModal} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}