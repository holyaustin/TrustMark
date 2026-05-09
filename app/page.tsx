// app/(public)/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Shield, QrCode, Clock, CheckCircle, Users, TrendingUp, Award, MapPin, Phone } from 'lucide-react';

export default function LandingPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<'register' | 'number' | 'location' | 'kyc' | 'success'>('register');
  const [userId, setUserId] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<{
    address: string;
    city: string;
    country: string;
  }>({ address: '', city: '', country: '' });
  const [kycData, setKycData] = useState<any>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Check if we're returning from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get('verified');
    const error = urlParams.get('error');
    const errorMessage = urlParams.get('message');
    const phoneFromUrl = urlParams.get('phone');
    const codeFromUrl = urlParams.get('code');
    const stateFromUrl = urlParams.get('state');
    
    console.log('OAuth callback params - verified:', verified, 'phone:', phoneFromUrl, 'code:', codeFromUrl, 'state:', stateFromUrl, 'error:', error, 'message:', errorMessage);
    
    if (verified === 'true' && phoneFromUrl) {
      // Show loading spinner immediately
      setIsVerifying(true);
      
      // Get pending business info from session storage
      const pendingInfo = sessionStorage.getItem('pendingBusinessInfo');
      console.log('Pending business info from sessionStorage:', pendingInfo);
      
      if (pendingInfo) {
        const businessInfo = JSON.parse(pendingInfo);
        console.log('Parsed business info:', businessInfo);
        
        // After OAuth success, complete registration with stored business info
        const completeRegistrationAfterOAuth = async () => {
          // Use code and state from URL (they are passed by the callback redirect)
          const code = codeFromUrl;
          const state = stateFromUrl;
          
          console.log('OAuth code from URL:', code, 'state:', state);
          
          if (!code || !state) {
            console.error('Missing code or state in URL');
            setOauthError('Missing verification code. Please try again.');
            setIsVerifying(false);
            sessionStorage.removeItem('pendingBusinessInfo');
            window.history.replaceState({}, '', '/');
            return;
          }
          
          try {
            // Call register API with OAuth code and state
            const res = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phoneNumber: phoneFromUrl,
                businessName: businessInfo.businessName,
                businessAddress: businessInfo.businessAddress,
                businessCity: businessInfo.businessCity,
                businessCountry: businessInfo.businessCountry,
                oauthCode: code,
                oauthState: state
              })
            });
            
            const data = await res.json();
            console.log('Registration response:', data);
            
            if (res.ok) {
              setUserId(data.userId);
              setKycData(data.kycData);
              setBusinessData({
                address: businessInfo.businessAddress,
                city: businessInfo.businessCity,
                country: businessInfo.businessCountry
              });
              setIsVerifying(false);
              setStep('location');
            } else {
              console.error('Registration failed:', data.error);
              setOauthError(data.error || 'Registration failed');
              setIsVerifying(false);
            }
          } catch (err) {
            console.error('Registration error:', err);
            setOauthError('Failed to complete registration');
            setIsVerifying(false);
          } finally {
            sessionStorage.removeItem('pendingBusinessInfo');
            // Clean URL without reloading
            window.history.replaceState({}, '', '/');
          }
        };
        
        completeRegistrationAfterOAuth();
      } else {
        // No pending business info - this could happen if sessionStorage was cleared
        console.warn('No pending business info found in sessionStorage');
        setOauthError('Missing business information. Please start registration again.');
        setIsVerifying(false);
        window.history.replaceState({}, '', '/');
      }
    }
    
    if (error) {
      console.error('Verification error from URL:', error, 'Message:', errorMessage);
      let displayMessage = 'Verification error occurred. Please try again.';
      if (error === 'verification_failed') {
        displayMessage = 'Number verification failed. Please try again.';
      } else if (error === 'missing_auth_params') {
        displayMessage = 'Missing authorization parameters. Please try again.';
      } else if (error === 'invalid_state') {
        displayMessage = 'Security validation failed. Please try again.';
      } else if (error === 'missing_phone') {
        displayMessage = 'Phone number missing. Please start registration again.';
      } else if (error === 'verification_error' && errorMessage) {
        displayMessage = `Verification error: ${errorMessage}. Please try again.`;
      }
      setOauthError(displayMessage);
      // Clean URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  useEffect(() => {
    if (user && user.badgeActive) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const closeModal = () => setStep('register');

  // Show loading spinner during OAuth verification
  if (isVerifying) {
    return <LoadingSpinner />;
  }

  if (user && user.badgeActive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      {/* Hero Section */}
      <section className="container-custom mb-16 md:mb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Restored badge - Network Verified • KYC Matched */}
          <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-royal-900/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4 text-royal-600 dark:text-royal-300" />
            <span className="text-sm font-medium text-royal-700 dark:text-royal-300">Network Verified • KYC Matched</span>
          </div>
          
          <div className="flex justify-center mb-6">
            <BadgeSymbol size="lg" showText={true} />
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

      {/* Trust Score Preview */}
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
                <BadgeSymbol size="md" showText={true} />
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
                <div className="flex justify-between"><span>KYC Data:</span><span className="font-semibold">5/15</span></div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works */}
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
            <p className="text-sm text-gray-500">Confirm you're at your business address</p>
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
                  <span>Location: Lagos, Nigeria</span>
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
              Empowering sellers and protecting buyers across Africa
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

      {/* OAuth Error Display */}
      {oauthError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {oauthError}
          <button 
            onClick={() => setOauthError(null)}
            className="ml-3 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Verification Modal */}
      {step !== 'register' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            {step === 'number' && (
              <NumberVerificationForm 
                onSuccess={(id, kyc, businessInfo) => { 
                  setUserId(id); 
                  setKycData(kyc);
                  if (businessInfo) {
                    setBusinessData({
                      address: businessInfo.address || '',
                      city: businessInfo.city || '',
                      country: businessInfo.country || ''
                    });
                  }
                  setStep('location'); 
                }} 
                onClose={closeModal} 
              />
            )}
            {step === 'location' && userId && (
              <LocationVerificationForm 
                userId={userId} 
                businessAddress={businessData.address}
                businessCity={businessData.city}
                businessCountry={businessData.country}
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