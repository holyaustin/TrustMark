// components/verification/VerificationSuccess.tsx
'use client';

import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CheckCircle, X } from 'lucide-react';

interface VerificationSuccessProps {
  onClose: () => void;
}

export default function VerificationSuccess({ onClose }: VerificationSuccessProps) {
  const router = useRouter();
  
  const goToDashboard = () => {
    onClose();
    router.push('/dashboard');
  };
  
  return (
    <Card className="p-6 relative text-center">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
      
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Verification Complete!</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Your TrustMark badge is now active. Buyers can now verify your identity.
      </p>
      <Button onClick={goToDashboard}>
        Go to Dashboard
      </Button>
    </Card>
  );
}