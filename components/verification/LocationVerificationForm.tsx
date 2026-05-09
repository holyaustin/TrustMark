// components/verification/LocationVerificationForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MapPin, Loader2, Navigation, X, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

interface LocationVerificationFormProps {
  userId: string;
  businessAddress: string;
  businessCity: string;
  businessCountry: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function LocationVerificationForm({ 
  userId, 
  businessAddress: propAddress,
  businessCity: propCity,
  businessCountry: propCountry,
  onSuccess, 
  onClose 
}: LocationVerificationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'fetching' | 'verifying' | 'success' | 'failed'>('idle');
  const [matchRate, setMatchRate] = useState<number | null>(null);
  
  // State for business info (can come from props or DB)
  const [businessAddress, setBusinessAddress] = useState(propAddress || '');
  const [businessCity, setBusinessCity] = useState(propCity || '');
  const [businessCountry, setBusinessCountry] = useState(propCountry || '');
  const [loadingBusiness, setLoadingBusiness] = useState(!propAddress && !propCity && !propCountry);

  // Fetch business data from DB if props are empty
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (propAddress && propCity && propCountry) {
        setBusinessAddress(propAddress);
        setBusinessCity(propCity);
        setBusinessCountry(propCountry);
        setLoadingBusiness(false);
        return;
      }
      
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          const userData = data.user;
          setBusinessAddress(userData.businessAddress || '');
          setBusinessCity(userData.businessCity || '');
          setBusinessCountry(userData.businessCountry || '');
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
      } finally {
        setLoadingBusiness(false);
      }
    };
    
    fetchBusinessData();
  }, [propAddress, propCity, propCountry, userId]);

  const verifyLocation = () => {
    setStatus('fetching');
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please use a modern browser.');
      setStatus('failed');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setStatus('verifying');
        setLoading(true);
        
        try {
          const response = await fetch('/api/verification/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              businessAddress,
              businessCity,
              businessCountry
            })
          });
          
          let data;
          try {
            data = await response.json();
          } catch {
            const text = await response.text();
            throw new Error(`Server returned: ${text.substring(0, 100)}`);
          }
          
          if (response.ok && data.verified) {
            setMatchRate(data.matchRate);
            setStatus('success');
            setTimeout(() => {
              onSuccess();
            }, 1500);
          } else {
            setError(data.message || `Location verification failed. Please ensure you are at your registered business address.`);
            setStatus('failed');
          }
        } catch (err: any) {
          console.error('Location verification error:', err);
          setError(err.message || 'Network error. Please try again.');
          setStatus('failed');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        let errorMessage = 'Unable to get your location. ';
        if (err.code === 1) {
          errorMessage += 'Please allow location access in your browser.';
        } else if (err.code === 2) {
          errorMessage += 'Location unavailable. Please check your GPS.';
        } else if (err.code === 3) {
          errorMessage += 'Location request timed out. Please try again.';
        } else {
          errorMessage += 'Please enable location access and ensure you are at your business address.';
        }
        setError(errorMessage);
        setStatus('failed');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const skipToDashboard = () => {
    // Close the modal and redirect to dashboard
    onClose();
    router.push('/dashboard');
  };

  // Build display address from available fields
  const displayAddress = [businessAddress, businessCity, businessCountry]
    .filter(field => field && field !== 'undefined' && field.trim() !== '')
    .join(', ') || 'Address not available';

  if (loadingBusiness) {
    return (
      <Card className="p-6 relative max-w-md w-full">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-royal-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading business information...</p>
        </div>
      </Card>
    );
  }

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
          <Navigation className="w-8 h-8 text-royal-600" />
        </div>
        <h2 className="text-2xl font-bold">Verify Your Business Location</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
          Using Nokia/CAMARA Location Verification API
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          <strong>Registered Address:</strong><br />
          {displayAddress}
        </p>
      </div>
      
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
          <p className="text-green-600 dark:text-green-400 font-semibold">Location Verified!</p>
          {matchRate && (
            <p className="text-sm text-gray-500 mt-1">
              Match confidence: {matchRate}%
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Your device is confirmed to be at your business location.
          </p>
          <Button onClick={skipToDashboard} className="mt-4 w-full">
            Continue to Dashboard →
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-royal-50 dark:bg-royal-900/30 p-4 rounded-lg mb-6">
            <MapPin className="w-6 h-6 text-royal-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              Using Nokia/CAMARA Location Verification API, we will confirm that your device
              is physically at your registered business address.
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              This helps buyers trust that your business exists at the stated location.
            </p>
          </div>
          
          <Button 
            onClick={verifyLocation} 
            disabled={loading || status !== 'idle'} 
            className="w-full mb-3"
          >
            {status === 'fetching' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {status === 'fetching' && 'Getting your location...'}
            {status === 'verifying' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {status === 'verifying' && 'Verifying with Nokia API...'}
            {status === 'idle' && 'Share My Location →'}
            {status === 'failed' && 'Try Again →'}
          </Button>
          
          {/* Skip to Dashboard Button - Shows when verification fails or user wants to skip */}
          {(status === 'failed' || error) && (
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