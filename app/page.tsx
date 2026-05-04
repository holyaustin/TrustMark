'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import NumberVerificationForm from '@/components/verification/NumberVerificationForm';
import LocationVerificationForm from '@/components/verification/LocationVerificationForm';
import VerificationSuccess from '@/components/verification/VerificationSuccess';
import { Shield, QrCode, Clock, Users, CheckCircle, Globe, ShoppingBag, Award } from 'lucide-react';

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
    <div className="space-y-16 md:space-y-24">
      
      {/* Hero Section - WITH MARGINS */}
      <section className="bg-gradient-to-br from-royal-50 to-white dark:from-royal-950 dark:to-black py-12 md:py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-royal-100 dark:bg-royal-900 px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4 text-royal-700 dark:text-royal-300" />
              <span className="text-sm font-medium text-royal-700 dark:text-royal-300">TrustMark Verified</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-royal-900 dark:text-white mb-4">
              Trust in Social Commerce
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              The digital trust badge that proves you're a legitimate seller. 
              Stop scammers. Build buyer confidence. Grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" onClick={() => setStep('number')}>
                Get Verified Now →
              </Button>
              <Button variant="outline" size="lg">
                <a href="#how-it-works">How It Works</a>
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Join 1,000+ verified sellers across Nigeria
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badge Preview - WITH MARGINS */}
      <section className="container-custom" id="how-it-works">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            What Buyers See
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A clear, trustworthy verification page that builds instant confidence
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <Card className="p-6 shadow-xl">
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
                  <span>Verified since Jan 15, 2026</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Grid - WITH MARGINS */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Why Choose TrustMark?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Network-verified identity that protects both buyers and sellers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-royal-600 dark:text-royal-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Network Verified</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We use mobile network APIs (CAMARA) to verify your phone number and business location.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6 text-royal-600 dark:text-royal-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Instant Share</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get a QR code and short link to share on WhatsApp, Instagram, Facebook, or any platform.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-royal-600 dark:text-royal-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">24/7 Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Continuous SIM swap monitoring. Badge auto-suspends if fraud is detected.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section - WITH MARGINS */}
      <section className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-6">
            <p className="text-3xl md:text-4xl font-bold text-royal-600 dark:text-royal-400">1,000+</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Verified Sellers</p>
          </div>
          <div className="p-6">
            <p className="text-3xl md:text-4xl font-bold text-royal-600 dark:text-royal-400">50,000+</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Buyer Verifications</p>
          </div>
          <div className="p-6">
            <p className="text-3xl md:text-4xl font-bold text-royal-600 dark:text-royal-400">99.9%</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Fraud Detection Rate</p>
          </div>
          <div className="p-6">
            <p className="text-3xl md:text-4xl font-bold text-royal-600 dark:text-royal-400">24/7</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">SIM Monitoring</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section - WITH MARGINS */}
      <section className="bg-gradient-to-r from-royal-50 to-blue-50 dark:from-royal-950 dark:to-blue-950 py-12 md:py-16">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Trusted by Sellers Across Africa
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real stories from real business owners
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <p className="text-gray-700 dark:text-gray-300 italic">
                "Since adding TrustMark to my WhatsApp bio, my sales have increased by 40%. 
                Customers trust me more and I've had zero fraud disputes."
              </p>
              <div className="mt-4">
                <p className="font-semibold text-gray-900 dark:text-white">— Amina, Fashion Seller, Lagos</p>
              </div>
            </Card>
            <Card className="p-6">
              <p className="text-gray-700 dark:text-gray-300 italic">
                "As a customer, I always check TrustMark before sending money. 
                It gives me confidence that I'm dealing with a real business."
              </p>
              <div className="mt-4">
                <p className="font-semibold text-gray-900 dark:text-white">— Chidi, Buyer, Abuja</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - WITH MARGINS */}
      <section className="container-custom pb-12 md:pb-16">
        <Card className="p-8 md:p-12 text-center bg-gradient-to-r from-royal-600 to-royal-800 dark:from-royal-700 dark:to-royal-900">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Build Trust?
          </h2>
          <p className="text-royal-100 mb-6 max-w-md mx-auto">
            Join hundreds of verified sellers who are growing their business with TrustMark.
          </p>
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={() => setStep('number')}
            className="bg-white text-royal-700 hover:bg-gray-100"
          >
            Get Your Badge Now →
          </Button>
        </Card>
      </section>

      {/* Verification Flow Modal/Section */}
      {step !== 'register' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            {step === 'number' && (
              <NumberVerificationForm onSuccess={(id) => { setUserId(id); setStep('location'); }} onClose={() => setStep('register')} />
            )}
            {step === 'location' && userId && (
              <LocationVerificationForm userId={userId} onSuccess={() => setStep('success')} onClose={() => setStep('register')} />
            )}
            {step === 'success' && (
              <VerificationSuccess onClose={() => setStep('register')} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}