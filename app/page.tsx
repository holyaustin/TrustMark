'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import BadgeSymbol from '@/components/ui/BadgeSymbol';
import NumberVerificationForm from '@/components/verification/NumberVerificationForm';
import LocationVerificationForm from '@/components/verification/LocationVerificationForm';
import KycFillInForm from '@/components/verification/KycFillInForm';
import VerificationSuccess from '@/components/verification/VerificationSuccess';
import { Shield, QrCode, Clock, CheckCircle, Users, TrendingUp, Award, MapPin, Phone } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<'register' | 'number' | 'location' | 'kyc' | 'success'>('register');
  const [userId, setUserId] = useState<string | null>(null);
  const [businessState, setBusinessState] = useState<string>('');
  const [kycData, setKycData] = useState<any>(null);

  if (user && user.badgeActive) {
    router.push('/dashboard');
    return null;
  }

  const closeModal = () => setStep('register');

  return (
    <div className="section-spacing">
      {/* Hero Section */}
      <section className="container-custom mb-16 md:mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <BadgeSymbol size="lg" showText={true} />
          </div>
          <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-royal-900/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4 text-royal-600 dark:text-royal-300" />
            <span className="text-sm font-medium text-royal-700 dark:text-royal-300">Network Verified • KYC Matched</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-royal-900 dark:text-white mb-4">
            Trust in Social Commerce
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            The AI-powered trust badge that proves you're a legitimate seller.
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
              <span>AI Trust Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Score Preview - NEW */}
      <section className="container-custom mb-16 md:mb-24">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            AI-Powered Trust Score
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Buyers see your trust score - higher score means more sales
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <Card className="card-padding shadow-xl">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <BadgeSymbol size="md" showText={false} />
              </div>
              <div className="text-4xl font-bold text-royal-600 mb-2">85<span className="text-xl">%</span></div>
              <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mb-3">
                Grade AA
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div className="bg-royal-600 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-left text-xs">
                <div className="flex justify-between"><span>KYC Match:</span><span className="font-semibold">20/20</span></div>
                <div className="flex justify-between"><span>SIM Swap:</span><span className="font-semibold">20/20</span></div>
                <div className="flex justify-between"><span>Number Verify:</span><span className="font-semibold">15/15</span></div>
                <div className="flex justify-between"><span>Location:</span><span className="font-semibold">15/15</span></div>
                <div className="flex justify-between"><span>Tenure:</span><span className="font-semibold">10/15</span></div>
                <div className="flex justify-between"><span>Age Verify:</span><span className="font-semibold">5/15</span></div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works - Updated with KYC Flow */}
      <section className="container-custom mb-16 md:mb-24" id="how-it-works">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            How It Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            3 simple steps to get your TrustMark badge
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-padding text-center">
            <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-royal-600" />
            </div>
            <div className="text-2xl font-bold text-royal-600 mb-2">1</div>
            <h3 className="font-semibold mb-2">Verify Number</h3>
            <p className="text-sm text-gray-500">Silent network verification - no OTP needed</p>
          </Card>
          <Card className="card-padding text-center">
            <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-royal-600" />
            </div>
            <div className="text-2xl font-bold text-royal-600 mb-2">2</div>
            <h3 className="font-semibold mb-2">Verify Location</h3>
            <p className="text-sm text-gray-500">Confirm you're in your business state</p>
          </Card>
          <Card className="card-padding text-center">
            <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-royal-600" />
            </div>
            <div className="text-2xl font-bold text-royal-600 mb-2">3</div>
            <h3 className="font-semibold mb-2">KYC Match</h3>
            <p className="text-sm text-gray-500">Verify identity with operator records</p>
          </Card>
        </div>
      </section>

      {/* Trust Badge Preview */}
      <section className="container-custom mb-16 md:mb-24">
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
              <div className="flex justify-center mb-4">
                <BadgeSymbol size="md" showText={true} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mama Blessing's Fashion</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">TrustMark Verified Seller</p>
              
              {/* Trust Score Badge */}
              <div className="mt-3 inline-flex items-center gap-2 bg-royal-50 dark:bg-royal-900/30 px-3 py-1 rounded-full">
                <Shield className="w-3 h-3 text-royal-600" />
                <span className="text-xs font-semibold text-royal-700">Trust Score: 92% (Grade AAA)</span>
              </div>
              
              <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-left space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>KYC Verified: Yes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Location: Lagos State</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>SIM Status: No recent swap (386 days safe)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Customer since: 2022 (3+ years)</span>
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
              Empowering sellers and protecting buyers across Nigeria
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

      {/* Features Grid - Updated with KYC */}
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
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">KYC Verified</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We match your identity with mobile operator records using KYC Match API.
            </p>
          </Card>
          <Card className="card-padding text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">AI Trust Score</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Dynamic 0-100% score based on 6 verification metrics. Higher score = More trust.
            </p>
          </Card>
          <Card className="card-padding text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-6 h-6 text-royal-600 dark:text-royal-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Instant Share</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get a QR code and short link to share on WhatsApp, Instagram, or any platform.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom pb-12 md:pb-16">
        <Card className="card-padding text-center bg-gradient-to-r from-royal-600 to-royal-800 dark:from-royal-700 dark:to-royal-900 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Build Trust?
          </h2>
          <p className="text-royal-100 mb-6 max-w-md mx-auto">
            Join thousands of verified sellers who are growing their business with TrustMark.
            Get your AI-powered trust score today.
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
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 shadow-xl">
                Verify a Seller →
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Verification Modal - Updated with KYC Step */}
      {step !== 'register' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            {step === 'number' && (
              <NumberVerificationForm 
                onSuccess={(id, kyc) => { 
                  setUserId(id); 
                  setKycData(kyc);
                  setStep('location'); 
                }} 
                onClose={closeModal} 
              />
            )}
            {step === 'location' && userId && (
              <LocationVerificationForm 
                userId={userId} 
                businessState={businessState}
                onSuccess={() => setStep('kyc')} 
                onClose={closeModal} 
              />
            )}
            {step === 'kyc' && userId && kycData && (
              <KycFillInForm 
                userId={userId} 
                kycData={kycData}
                onSuccess={() => setStep('success')} 
                onClose={closeModal} 
              />
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