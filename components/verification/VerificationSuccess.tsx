'use client';

import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function VerificationSuccess() {
  const router = useRouter();
  
  return (
    <Card className="p-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Verification Complete!</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Your TrustMark badge is now active. Buyers can now verify your identity.
      </p>
      <Button onClick={() => router.push('/dashboard')}>
        Go to Dashboard
      </Button>
    </Card>
  );
}