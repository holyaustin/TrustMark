// components/verification/LocationVerificationForm.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MapPin, Loader2, Navigation, X, CheckCircle } from 'lucide-react';

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
  businessAddress, 
  businessCity, 
  businessCountry, 
  onSuccess, 
  onClose 
}: LocationVerificationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'fetching' | 'verifying' | 'success' | 'failed'>('idle');
  const [matchRate, setMatchRate] = useState<number | null>(null);

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

  const locationText = `${businessAddress}, ${businessCity}, ${businessCountry}`;

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
          Confirm you are at your registered business address
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          <strong>Registered Address:</strong><br />
          {locationText}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
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
            className="w-full"
          >
            {status === 'fetching' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {status === 'fetching' && 'Getting your location...'}
            {status === 'verifying' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {status === 'verifying' && 'Verifying with Nokia API...'}
            {status === 'idle' && 'Share My Location →'}
            {status === 'failed' && 'Try Again →'}
          </Button>
        </>
      )}
    </Card>
  );
}