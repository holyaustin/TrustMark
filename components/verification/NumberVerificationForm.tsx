// components/verification/NumberVerificationForm.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Phone, Loader2, CheckCircle } from 'lucide-react';

interface NumberVerificationFormProps {
  onSuccess: (userId: string, kycData: any) => void;
}

export default function NumberVerificationForm({ onSuccess }: NumberVerificationFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessState, setBusinessState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phoneNumber, 
        businessName, 
        businessAddress,
        businessState
      })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      onSuccess(data.userId, data.kycData);
    } else {
      setError(data.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-royal-100 dark:bg-royal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-royal-600" />
        </div>
        <h2 className="text-2xl font-bold">Get Your TrustMark Badge</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
          Step 1 of 3: Verify your phone number
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      <input
        type="tel"
        placeholder="Phone number (e.g., 08012345678)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-3 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500 focus:border-transparent"
      />
      
      <input
        type="text"
        placeholder="Business name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-3 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500"
      />
      
      <input
        type="text"
        placeholder="Business address (e.g., 15 Allen Avenue)"
        value={businessAddress}
        onChange={(e) => setBusinessAddress(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-3 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500"
      />
      
      <select
        value={businessState}
        onChange={(e) => setBusinessState(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500"
      >
        <option value="">Select State</option>
        <option value="Lagos">Lagos</option>
        <option value="Abuja">Abuja FCT</option>
        <option value="Rivers">Rivers</option>
        <option value="Oyo">Oyo</option>
        <option value="Kano">Kano</option>
        <option value="Anambra">Anambra</option>
        <option value="Enugu">Enugu</option>
        <option value="Delta">Delta</option>
        <option value="Edo">Edo</option>
        <option value="Ogun">Ogun</option>
      </select>
      
      <Button 
        onClick={handleSubmit} 
        disabled={loading || !phoneNumber || !businessName || !businessAddress || !businessState} 
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Verifying with Network...
          </>
        ) : (
          'Verify Phone Number →'
        )}
      </Button>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        We'll silently verify your number using mobile network APIs. No OTP required.
      </p>
    </Card>
  );
}