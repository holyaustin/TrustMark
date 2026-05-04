'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function NumberVerificationForm({ onSuccess }: { onSuccess: (userId: string) => void }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, businessName, businessAddress })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      onSuccess(data.userId);
    } else {
      setError(data.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-2">Get Your TrustMark Badge</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Step 1 of 2: Verify your phone number</p>
      
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
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-3 bg-white dark:bg-gray-800"
      />
      
      <input
        type="text"
        placeholder="Business name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-3 bg-white dark:bg-gray-800"
      />
      
      <input
        type="text"
        placeholder="Business address (e.g., Shop 12, Lagos Market)"
        value={businessAddress}
        onChange={(e) => setBusinessAddress(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-white dark:bg-gray-800"
      />
      
      <Button onClick={handleSubmit} disabled={loading || !phoneNumber || !businessName || !businessAddress} className="w-full">
        {loading ? 'Verifying...' : 'Verify Phone Number →'}
      </Button>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        We'll silently verify your number. No OTP required.
      </p>
    </Card>
  );
}