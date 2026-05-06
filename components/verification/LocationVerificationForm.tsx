// components/verification/LocationVerificationForm.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MapPin, Loader2, Navigation } from 'lucide-react';

interface LocationVerificationFormProps {
  userId: string;
  businessState: string;
  onSuccess: () => void;
}

export default function LocationVerificationForm({ userId, businessState, onSuccess }: LocationVerificationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'fetching' | 'verifying' | 'success' | 'failed'>('idle');

  const verifyLocation = () => {
    setStatus('fetching');
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setStatus('failed');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setStatus('verifying');
        setLoading(true);
        
        const res = await fetch('/api/verification/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            expectedState: businessState
          })
        });
        
        const data = await res.json();
        
        if (res.ok && data.verified) {
          setStatus('success');
          setTimeout(onSuccess, 1500);
        } else {
          setError(data.message || `Location verification failed. We need to confirm you are in ${businessState} state.`);
          setStatus('failed');
        }
        setLoading(false);
      },
      (err) => {
        setError('Unable to get your location. Please enable location access and ensure you are in ' + businessState);
        setStatus('failed');
        console.error(err);
      }
    );
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-royal-100 dark:bg-royal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Navigation className="w-8 h-8 text-royal-600" />
        </div>
        <h2 className="text-2xl font-bold">Verify Your Business Location</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
          Step 2 of 3: Confirm you are in <strong>{businessState}</strong> state
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
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-green-600 dark:text-green-400 font-semibold">Location Verified!</p>
          <p className="text-sm text-gray-500 mt-2">
            You are confirmed to be in {businessState} state.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-royal-50 dark:bg-royal-900/30 p-4 rounded-lg mb-6">
            <MapPin className="w-6 h-6 text-royal-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              We need to confirm you are physically located in <strong>{businessState}</strong> state.
              <br />
              <span className="text-xs">(We don't need your exact address - just your state for verification)</span>
            </p>
          </div>
          
          <Button onClick={verifyLocation} disabled={loading || status !== 'idle'} className="w-full">
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