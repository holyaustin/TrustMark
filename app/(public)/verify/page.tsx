// app/(public)/verify/page.tsx (for buyers to verify a seller)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Shield, Search, Loader2 } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const [badgeId, setBadgeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!badgeId.trim()) {
      setError('Please enter a badge ID or scan QR code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Redirect to verification page
    router.push(`/verify/${badgeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container-custom max-w-md mx-auto">
        <Card className="p-6 text-center">
          <div className="w-16 h-16 bg-royal-100 dark:bg-royal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-royal-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Verify a Seller</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enter the TrustMark badge ID or scan the QR code to verify a seller's identity
          </p>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <input
            type="text"
            placeholder="Enter badge ID (e.g., ABC123)"
            value={badgeId}
            onChange={(e) => setBadgeId(e.target.value.toUpperCase())}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500"
          />
          
          <Button onClick={handleVerify} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Seller →'
            )}
          </Button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Badge ID format: 6-character code found on seller's TrustMark badge
          </p>
        </Card>
      </div>
    </div>
  );
}