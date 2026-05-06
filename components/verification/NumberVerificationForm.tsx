// components/verification/NumberVerificationForm.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Phone, Loader2, X, Info } from 'lucide-react';

interface NumberVerificationFormProps {
  onSuccess: (userId: string, kycData: any) => void;
  onClose: () => void;
}

// Simulator test numbers from documentation
const SIMULATOR_NUMBERS = [
  { value: '+99999991000', label: '✅ Verified Number (Success)', verified: true },
  { value: '+99999991001', label: '❌ Not Verified Number', verified: false },
  { value: '+99999990400', label: '⚠️ Bad Request (400)', verified: false, error: true },
  { value: '+99999990404', label: '⚠️ Not Found (404)', verified: false, error: true },
  { value: '+99999990500', label: '⚠️ Server Error (500)', verified: false, error: true },
];

export default function NumberVerificationForm({ onSuccess, onClose }: NumberVerificationFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessState, setBusinessState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSimulatorHelp, setShowSimulatorHelp] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    // Ensure phone number starts with +
    let formattedNumber = phoneNumber;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = '+' + formattedNumber.replace(/[^0-9]/g, '');
    }
    
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phoneNumber: formattedNumber, 
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

  const fillSimulatorNumber = (number: string) => {
    setPhoneNumber(number);
    setShowSimulatorHelp(false);
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
        placeholder="Phone number (e.g., +99999991000)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-2 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500 focus:border-transparent"
      />
      
      {/* Simulator Help Button */}
      <button
        type="button"
        onClick={() => setShowSimulatorHelp(!showSimulatorHelp)}
        className="text-xs text-royal-600 dark:text-royal-400 flex items-center gap-1 mb-3"
      >
        <Info className="w-3 h-3" />
        <span>Testing? Use simulator numbers</span>
      </button>
      
      {/* Simulator Numbers Dropdown */}
      {showSimulatorHelp && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">Simulator Test Numbers:</p>
          <div className="space-y-1">
            {SIMULATOR_NUMBERS.map((num) => (
              <button
                key={num.value}
                onClick={() => fillSimulatorNumber(num.value)}
                className="text-xs text-left w-full p-1 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded transition"
              >
                {num.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
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
        Using Nokia Network-as-Code API. Test numbers: +99999991000 (verified) or +99999991001 (not verified)
      </p>
    </Card>
  );
}