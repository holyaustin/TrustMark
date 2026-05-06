// components/verification/SimSwapAlert.tsx
'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { AlertTriangle, Shield, X } from 'lucide-react';

interface SimSwapAlertProps {
  onResolve: () => void;
}

export default function SimSwapAlert({ onResolve }: SimSwapAlertProps) {
  return (
    <Card className="p-4 mb-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 relative">
      <button 
        onClick={onResolve}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition"
      >
        <X className="w-4 h-4 text-red-500" />
      </button>
      
      <div className="flex items-start gap-3 pr-8">
        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-700 dark:text-red-400">SIM Swap Detected</h3>
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
            Our system has detected a recent SIM card change on your phone number.
            Your TrustMark badge has been automatically suspended to prevent fraud.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => window.location.href = '/support'}
            >
              <Shield className="w-4 h-4 mr-2" />
              Contact Support to Re-verify
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/faq/sim-swap', '_blank')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}