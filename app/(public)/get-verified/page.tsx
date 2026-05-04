'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import NumberVerificationForm from '@/components/verification/NumberVerificationForm';
import LocationVerificationForm from '@/components/verification/LocationVerificationForm';
import VerificationSuccess from '@/components/verification/VerificationSuccess';

export default function GetVerifiedPage() {
  const [step, setStep] = useState<'number' | 'location' | 'success'>('number');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const closeModal = () => router.push('/');

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
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
  );
}