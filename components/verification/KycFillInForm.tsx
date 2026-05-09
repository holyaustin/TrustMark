// components/verification/KycFillInForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { UserCheck, Loader2, X, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

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
  const router = useRouter();
  const [fullName, setFullName] = useState(kycData?.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState(kycData?.birthdate?.split('T')[0] || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
  const [trustScore, setTrustScore] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!fullName) {
      setError('Please enter your full name as registered with your SIM');
      return;
    }

    setStatus('verifying');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verification/kyc-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fullName, dateOfBirth })
      });

      const data = await res.json();

      if (res.ok && data.matched) {
        setTrustScore(data.trustScore);
        setStatus('success');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(data.message || 'KYC verification failed. Please ensure your name matches your SIM registration.');
        setStatus('failed');
      }
    } catch (err: any) {
      console.error('KYC verification error:', err);
      setError(err.message || 'Network error. Please try again.');
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const skipToDashboard = () => {
    onClose();
    router.push('/dashboard');
  };

  return (
    <Card className="p-6 relative max-w-md w-full">
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
          KYC Verification (20 points)
        </p>
      </div>
      
      {kycData?.fullName && (
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mb-4 text-sm">
          <p className="text-blue-700 dark:text-blue-400">
            ℹ️ Network data retrieved. Please confirm or update your information below.
          </p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p>{error}</p>
              <p className="text-xs mt-1 text-red-500">
                You can still proceed to dashboard and complete verification later.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {status === 'success' ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-green-600 dark:text-green-400 font-semibold">KYC Verified!</p>
          {trustScore && (
            <p className="text-sm text-gray-500 mt-1">
              Trust Score updated: {trustScore}%
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Your identity has been successfully verified.
          </p>
          <Button onClick={skipToDashboard} className="mt-4 w-full">
            Continue to Dashboard →
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500"
              placeholder="e.g., Adebayo Ogunlesi"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Adding your date of birth helps improve your trust score.
            </p>
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !fullName || status === 'verifying'} 
            className="w-full mb-3"
          >
            {status === 'verifying' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {status === 'verifying' && 'Verifying...'}
            {'Complete Verification →'}
          </Button>
          
          {/* Skip to Dashboard Button - Shows when verification fails */}
          {status === 'failed' && (
            <Button 
              variant="outline" 
              onClick={skipToDashboard}
              className="w-full"
            >
              Skip to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {/* Always show skip option at bottom for convenience */}
          {status === 'idle' && (
            <button
              onClick={skipToDashboard}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mt-3 py-2 transition"
            >
              Skip for now → Complete verification later from dashboard
            </button>
          )}
        </>
      )}
    </Card>
  );
}