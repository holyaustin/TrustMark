'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { X, Phone, Building, MapPin } from 'lucide-react';

interface NumberVerificationFormProps {
  onSuccess: (userId: string) => void;
  onClose: () => void;
}

export default function NumberVerificationForm({ 
  onSuccess, 
  onClose 
}: NumberVerificationFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Validate all fields
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!businessName.trim()) {
      setError('Business name is required');
      return;
    }
    if (!businessAddress.trim()) {
      setError('Business address is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: phoneNumber.trim(), 
          businessName: businessName.trim(), 
          businessAddress: businessAddress.trim() 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onSuccess(data.userId);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Close"
      >
        <X size={20} />
      </button>
      
      <h2 className="text-2xl font-bold mb-2 pr-8">Get Your TrustMark Badge</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Step 1 of 2: Verify your phone number</p>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              placeholder="08012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-royal-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Enter your active mobile number</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Business Name
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Your Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-royal-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Business Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Shop 12, Lagos Market"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-royal-500"
            />
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleSubmit} 
        disabled={loading || !phoneNumber || !businessName || !businessAddress} 
        className="w-full mt-6"
      >
        {loading ? 'Verifying...' : 'Verify Phone Number →'}
      </Button>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        We'll silently verify your number using mobile network APIs. No OTP required.
      </p>
    </Card>
  );
}