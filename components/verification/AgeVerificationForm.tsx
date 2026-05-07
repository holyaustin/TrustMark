// components/verification/AgeVerificationForm.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Calendar, Loader2, X } from 'lucide-react';

interface AgeVerificationFormProps {
  userId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function AgeVerificationForm({ userId, onSuccess, onClose }: AgeVerificationFormProps) {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!dateOfBirth) {
      setError('Please select your date of birth');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userDateOfBirth: dateOfBirth })
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save date of birth');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <Calendar className="w-8 h-8 text-royal-600" />
        </div>
        <h2 className="text-2xl font-bold">Add Date of Birth</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
          This adds +15 points to your trust score
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Date of Birth</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-royal-500"
        />
      </div>
      
      <Button onClick={handleSubmit} disabled={loading || !dateOfBirth} className="w-full">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Saving...
          </>
        ) : (
          'Save Date of Birth →'
        )}
      </Button>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        Your date of birth is only used for age verification and trust score calculation.
      </p>
    </Card>
  );
}