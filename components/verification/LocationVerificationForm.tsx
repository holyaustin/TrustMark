'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MapPin, Loader2 } from 'lucide-react';

export default function LocationVerificationForm({ userId, onSuccess }: { userId: string; onSuccess: () => void }) {
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
            longitude: position.coords.longitude
          })
        });
        
        const data = await res.json();
        
        if (res.ok && data.verified) {
          setStatus('success');
          setTimeout(onSuccess, 1500);
        } else {
          setError(data.message || 'Location verification failed');
          setStatus('failed');
        }
        setLoading(false);
      },
      (err) => {
        setError('Unable to get your location. Please enable location access.');
        setStatus('failed');
        console.error(err);
      }
    );
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-2">Verify Your Business Location</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Step 2 of 2: Confirm you're at your business address</p>
      
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
          <p className="text-sm text-gray-500 mt-2">Redirecting to your dashboard...</p>
        </div>
      ) : (
        <>
          <div className="bg-royal-50 dark:bg-royal-900/30 p-4 rounded-lg mb-6 text-center">
            <MapPin className="w-8 h-8 text-royal-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              We need to confirm you are physically at your registered business address.
              <br />
              <strong>Allow location access when prompted.</strong>
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