// app/(public)/get-verified/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import NumberVerificationForm from '@/components/verification/NumberVerificationForm';
import LocationVerificationForm from '@/components/verification/LocationVerificationForm';
import KycFillInForm from '@/components/verification/KycFillInForm';
import VerificationSuccess from '@/components/verification/VerificationSuccess';

export default function GetVerifiedPage() {
  const router = useRouter();
  const [step, setStep] = useState<'number' | 'location' | 'kyc' | 'success'>('number');
  const [userId, setUserId] = useState<string | null>(null);
  const [businessInfo, setBusinessInfo] = useState<{
    address: string;
    city: string;
    country: string;
  }>({ address: '', city: '', country: '' });
  const [kycData, setKycData] = useState<any>(null);

  const closeModal = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container-custom max-w-md mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className={`flex-1 h-1 rounded-full transition-all ${
              step === 'number' ? 'bg-royal-600' : 'bg-green-500'
            }`} />
            <div className={`flex-1 h-1 rounded-full transition-all mx-1 ${
              step === 'location' ? 'bg-royal-600' : step === 'kyc' || step === 'success' ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
            <div className={`flex-1 h-1 rounded-full transition-all ${
              step === 'kyc' ? 'bg-royal-600' : step === 'success' ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Phone</span>
            <span>Location</span>
            <span>KYC</span>
          </div>
        </div>

        {step === 'number' && (
          <NumberVerificationForm 
            onSuccess={(id, kyc, business) => {
              setUserId(id);
              setKycData(kyc);
              setBusinessInfo({
                address: business.address,
                city: business.city,
                country: business.country
              });
              setStep('location');
            }} 
            onClose={closeModal}
          />
        )}
        
        {step === 'location' && userId && (
          <LocationVerificationForm 
            userId={userId} 
            businessAddress={businessInfo.address}
            businessCity={businessInfo.city}
            businessCountry={businessInfo.country}
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
  );
}