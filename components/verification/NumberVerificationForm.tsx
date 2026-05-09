// components/verification/NumberVerificationForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Phone, Loader2, X, Info, ArrowRight } from 'lucide-react';

interface NumberVerificationFormProps {
  onSuccess: (userId: string, kycData: any, businessInfo: { address: string; city: string; country: string }) => void;
  onClose: () => void;
}

// African countries list for dropdown
const AFRICAN_COUNTRIES = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'GH', name: 'Ghana' },
  { code: 'EG', name: 'Egypt' },
  { code: 'MA', name: 'Morocco' },
  { code: 'SN', name: 'Senegal' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'UG', name: 'Uganda' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'BW', name: 'Botswana' },
  { code: 'NA', name: 'Namibia' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'AO', name: 'Angola' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'ML', name: 'Mali' },
  { code: 'NE', name: 'Niger' },
  { code: 'TD', name: 'Chad' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'SD', name: 'Sudan' },
  { code: 'LY', name: 'Libya' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GN', name: 'Guinea' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'LR', name: 'Liberia' },
  { code: 'BJ', name: 'Benin' },
  { code: 'TG', name: 'Togo' },
  { code: 'BI', name: 'Burundi' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'SO', name: 'Somalia' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'CV', name: 'Cabo Verde' },
  { code: 'KM', name: 'Comoros' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'GA', name: 'Gabon' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'DR Congo' },
];

const SIMULATOR_NUMBERS = [
  { value: '+99999991000', label: '✅ Verified Number', verified: true },
  { value: '+99999991001', label: '❌ Not Verified Number', verified: false },
  { value: '+99999991002', label: '⚠️ Partial Verification', verified: true },
];

export default function NumberVerificationForm({ onSuccess, onClose }: NumberVerificationFormProps) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessCity, setBusinessCity] = useState('');
  const [businessCountry, setBusinessCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSimulatorHelp, setShowSimulatorHelp] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    let formattedNumber = phoneNumber;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = '+' + formattedNumber.replace(/[^0-9]/g, '');
    }
    
    const businessInfo = {
      phoneNumber: formattedNumber,
      businessName,
      businessAddress,
      businessCity,
      businessCountry
    };
    
    sessionStorage.setItem('pendingBusinessInfo', JSON.stringify(businessInfo));
    
    try {
      const authRes = await fetch('/api/auth/number-verification/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: formattedNumber,
          redirectUri: `${window.location.origin}/api/auth/number-verification/callback`
        })
      });
      
      const authData = await authRes.json();
      
      if (!authRes.ok) {
        throw new Error(authData.error || 'Failed to initialize verification');
      }
      
      // Store that we're in the middle of verification
      sessionStorage.setItem('verificationInProgress', 'true');
      sessionStorage.setItem('verificationStartTime', Date.now().toString());
      
      // Redirect to Nokia authorization page
      window.location.href = authData.authUrl;
      
    } catch (err: any) {
      console.error('Verification initiation error:', err);
      setError(err.message || 'Failed to start verification process');
      setLoading(false);
      sessionStorage.removeItem('pendingBusinessInfo');
    }
  };

  const fillSimulatorNumber = (number: string) => {
    setPhoneNumber(number);
    setShowSimulatorHelp(false);
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
        placeholder="Phone number (e.g., +2348012345678)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-2 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500 focus:border-transparent"
      />
      
      <button
        type="button"
        onClick={() => setShowSimulatorHelp(!showSimulatorHelp)}
        className="text-xs text-royal-600 dark:text-royal-400 flex items-center gap-1 mb-3"
      >
        <Info className="w-3 h-3" />
        <span>Testing? Use simulator numbers</span>
      </button>
      
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
        placeholder="Business address (street, building, landmark)"
        value={businessAddress}
        onChange={(e) => setBusinessAddress(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-3 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500"
      />
      
      <input
        type="text"
        placeholder="City (e.g., Lagos, Nairobi, Cape Town)"
        value={businessCity}
        onChange={(e) => setBusinessCity(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-3 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500"
      />
      
      <select
        value={businessCountry}
        onChange={(e) => setBusinessCountry(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500"
      >
        <option value="">Select Country</option>
        {AFRICAN_COUNTRIES.map((country) => (
          <option key={country.code} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
      
      <Button 
        onClick={handleSubmit} 
        disabled={loading || !phoneNumber || !businessName || !businessAddress || !businessCity || !businessCountry} 
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Redirecting to verification...
          </>
        ) : (
          'Verify Phone Number →'
        )}
      </Button>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        You will be redirected to your mobile operator to verify your number.
      </p>
      {/**
      <button
        onClick={skipToDashboard}
        className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mt-3 py-2 transition"
      >
        Skip for now → Complete verification later from dashboard
      </button>
       */}
    </Card>
  );
}