'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface KYCCompletionWidgetProps {
  profile: {
    kycMatchVerified?: boolean;
    locationVerified?: boolean;
    numberVerified?: boolean;
    userDateOfBirth?: string;
    tenureValid?: boolean;
    simSwapDetected?: boolean;
  };
  onUpdate: () => void;
}

export default function KYCCompletionWidget({ profile, onUpdate }: KYCCompletionWidgetProps) {
  const items = [
    {
      key: 'kyc',
      label: 'KYC Match',
      description: 'Verify your identity matches SIM registration',
      completed: profile.kycMatchVerified || false,
      points: 20,
      action: '/dashboard/kyc'
    },
    {
      key: 'sim',
      label: 'SIM Swap Status',
      description: 'No recent SIM card changes',
      completed: !profile.simSwapDetected,
      points: 20,
      action: profile.simSwapDetected ? '/support' : null
    },
    {
      key: 'number',
      label: 'Number Verification',
      description: 'Phone number verified with network',
      completed: profile.numberVerified || false,
      points: 15,
      action: null
    },
    {
      key: 'age',
      label: 'Age Verification',
      description: 'Date of birth provided',
      completed: !!profile.userDateOfBirth,
      points: 15,
      action: '/dashboard/age-verification'
    },
    {
      key: 'tenure',
      label: 'Account Tenure',
      description: 'Long-term relationship with operator',
      completed: profile.tenureValid || false,
      points: 15,
      action: null
    },
    {
      key: 'location',
      label: 'Location Verification',
      description: 'Confirmed business location state',
      completed: profile.locationVerified || false,
      points: 15,
      action: '/dashboard/location'
    }
  ];

  const completedCount = items.filter(i => i.completed).length;
  const totalPoints = items.reduce((sum, i) => sum + (i.completed ? i.points : 0), 0);
  const maxPoints = items.reduce((sum, i) => sum + i.points, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">KYC & Verification Status</h3>
        <div className="text-right">
          <p className="text-sm font-medium">{totalPoints}/{maxPoints} points</p>
          <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className="bg-royal-600 h-1.5 rounded-full transition-all"
              style={{ width: `${(totalPoints / maxPoints) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.key}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              item.completed 
                ? 'bg-green-50 dark:bg-green-900/20' 
                : 'bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              {item.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-royal-600">{item.points} pts</span>
              {!item.completed && item.action && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={() => window.location.href = item.action!}
                >
                  Complete <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
              {!item.completed && !item.action && (
                <span className="text-xs text-gray-400">Auto</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {completedCount !== items.length && (
        <div className="mt-4 p-3 bg-royal-50 dark:bg-royal-900/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-royal-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-royal-700 dark:text-royal-300">
              Complete missing verifications to increase your trust score and unlock your badge.
              Higher trust score = more buyer confidence = more sales.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}