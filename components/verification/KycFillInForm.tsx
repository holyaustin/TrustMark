// components/verification/KycFillInForm.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { UserCheck, Loader2, X } from 'lucide-react';

interface KycFillInFormProps {
  userId: string;
  kycData: {
    fullName: string;
    address: string;
    birthdate: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export default function KycFillInForm({ userId, kycData, onSuccess, onClose }: KycFillInFormProps) {
  const [fullName, setFullName] = useState(kycData?.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState(kycData?.birthdate?.split('T')[0] || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    const res = await fetch('/api/verification/kyc-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, fullName, dateOfBirth })
    });
    
    const data = await res.json();
    
    if (res.ok && data.matched) {
      onSuccess();
    } else {
      setError(data.message || 'KYC verification failed. Please ensure your name matches your SIM registration.');
    }
    setLoading(false);
  };

  return (
    <Card className="p-6 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
      
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-royal-100 dark:bg-royal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserCheck className="w-8 h-8 text-royal-600" />
        </div>
        <h2 className="text-2xl font-bold">Confirm Your Identity</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
          Step 3 of 3: KYC Verification (20 points)
        </p>
      </div>
      
      {kycData?.fullName && (
        <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg mb-4 text-sm">
          <p className="text-green-700 dark:text-green-400">
            ✓ Network data retrieved. Please confirm your information below.
          </p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Full Name (as registered with SIM)</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500"
          placeholder="e.g., Adebayo Ogunlesi"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Date of Birth</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500"
        />
      </div>
      
      <Button onClick={handleSubmit} disabled={loading || !fullName} className="w-full">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Verifying with Network...
          </>
        ) : (
          'Complete Verification →'
        )}
      </Button>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        We'll match your information with mobile operator records using KYC Match API.
        This adds 20 points to your trust score.
      </p>
    </Card>
  );
}