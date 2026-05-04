'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Search, Shield } from 'lucide-react';

export default function VerifySellerPage() {
  const [sellerId, setSellerId] = useState('');
  const [searchResult, setSearchResult] = useState<null | { businessName: string; verified: boolean }>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    // Simulate API call - in production, call your API
    setTimeout(() => {
      if (sellerId) {
        setSearchResult({
          businessName: 'Mama Blessing\'s Fashion',
          verified: true
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Verify a Seller
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the seller's TrustMark ID or scan their QR code to verify their identity
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">TrustMark ID or Phone Number</label>
              <input
                type="text"
                placeholder="e.g., TRUST-ABC123 or 08012345678"
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading || !sellerId} className="w-full">
              <Search size={18} className="mr-2" />
              {loading ? 'Verifying...' : 'Verify Seller'}
            </Button>
          </div>

          {searchResult && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-300">Verified Seller</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{searchResult.businessName}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}