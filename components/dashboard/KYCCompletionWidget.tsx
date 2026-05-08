// components/dashboard/KYCCompletionWidget.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, MapPin, UserCheck, Database, Smartphone, Shield, Clock } from 'lucide-react';
import LocationVerificationForm from '@/components/verification/LocationVerificationForm';
import KycFillInForm from '@/components/verification/KycFillInForm';

interface KYCCompletionWidgetProps {
  profile: {
    id?: string;
    kycMatchVerified?: boolean;
    locationVerified?: boolean;
    numberVerified?: boolean;
    tenureValid?: boolean;
    simSwapDetected?: boolean;
    kycDataComplete?: boolean;
    businessAddress?: string;
    businessCity?: string;
    businessCountry?: string;
    kycData?: {
      fullName?: string;
      address?: string;
      birthdate?: string;
    };
  };
  onUpdate: () => void;
}

export default function KYCCompletionWidget({ profile, onUpdate }: KYCCompletionWidgetProps) {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  // Calculate KYC Data Completeness based on actual operator data
  const isKycDataComplete = !!(
    profile.kycData?.fullName && 
    profile.kycData?.address && 
    profile.kycData?.fullName.length > 0 &&
    profile.kycData?.address.length > 0
  );

  // 6 metrics with NEW weights
  const items = [
    {
      key: 'kycMatch',
      label: 'KYC Match',
      description: 'Identity verified against SIM registration',
      completed: profile.kycMatchVerified || false,
      points: 20,
      action: () => setShowKycModal(true),
      icon: UserCheck
    },
    {
      key: 'simSwap',
      label: 'SIM Swap Status',
      description: 'No recent SIM card changes detected',
      completed: !profile.simSwapDetected,
      points: 15,
      action: null,
      icon: Shield
    },
    {
      key: 'numberVerify',
      label: 'Number Verification',
      description: 'Phone number is active and belongs to you',
      completed: profile.numberVerified || false,
      points: 10,
      action: null,
      auto: true,
      icon: Smartphone
    },
    {
      key: 'tenure',
      label: 'Account Tenure',
      description: 'Time with mobile operator',
      completed: profile.tenureValid || false,
      points: 25,
      action: null,
      auto: true,
      icon: Clock
    },
    {
      key: 'location',
      label: 'Location Verification',
      description: 'Device at registered business address',
      completed: profile.locationVerified || false,
      points: 15,
      action: () => setShowLocationModal(true),
      icon: MapPin
    },
    {
      key: 'kycData',
      label: 'KYC Data Completeness',
      description: 'Operator has complete profile (name, address)',
      completed: isKycDataComplete,
      points: 15,
      action: null,
      auto: true,
      icon: Database
    }
  ];

  const completedCount = items.filter(i => i.completed).length;
  const totalPoints = items.reduce((sum, i) => sum + (i.completed ? i.points : 0), 0);
  const maxPoints = items.reduce((sum, i) => sum + i.points, 0);

  const handleLocationSuccess = () => {
    setShowLocationModal(false);
    onUpdate();
  };

  const handleKycSuccess = () => {
    setShowKycModal(false);
    onUpdate();
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">KYC & Verification Status</h3>
          <div className="text-right">
            <p className="text-sm font-medium">{completedCount}/{items.length} Complete</p>
            <p className="text-xs text-gray-500">{totalPoints}/{maxPoints} points earned</p>
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
                  ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' 
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
                  <p className="font-medium text-sm flex items-center gap-2">
                    {item.label}
                    {item.icon && <item.icon className="w-3 h-3 text-gray-400" />}
                    {item.auto && item.completed && (
                      <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">Auto</span>
                    )}
                    {item.auto && !item.completed && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">Auto</span>
                    )}
                  </p>
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
                    onClick={item.action}
                  >
                    Complete <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
                {!item.completed && item.auto && (
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
                Complete all 6 verifications to reach 100 points and unlock your badge.
                Account Tenure gives the most points (25) - build history with your operator!
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Location Verification Modal */}
      {showLocationModal && profile.id && profile.businessAddress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowLocationModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <LocationVerificationForm 
              userId={profile.id} 
              businessAddress={profile.businessAddress}
              businessCity={profile.businessCity || ''}
              businessCountry={profile.businessCountry || ''}
              onSuccess={handleLocationSuccess}
              onClose={() => setShowLocationModal(false)}
            />
          </div>
        </div>
      )}

      {/* KYC Verification Modal */}
      {showKycModal && profile.id && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowKycModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <KycFillInForm 
              userId={profile.id}
              kycData={{
                fullName: profile.kycData?.fullName || '',
                address: profile.businessAddress || '',
                birthdate: profile.kycData?.birthdate || ''
              }}
              onSuccess={handleKycSuccess}
              onClose={() => setShowKycModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}