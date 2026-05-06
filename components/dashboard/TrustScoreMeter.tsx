// components/dashboard/TrustScoreMeter.tsx
'use client';

import Card from '@/components/ui/Card';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface TrustScoreMeterProps {
  score: number;
  grade: string;
  breakdown?: {
    kycMatch: number;
    simSwap: number;
    numberVerification: number;
    ageVerification: number;
    tenure: number;
    location: number;
  };
}

export default function TrustScoreMeter({ score, grade, breakdown }: TrustScoreMeterProps) {
  const getGradeColor = () => {
    if (grade === 'AAA' || grade === 'AA') return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (grade === 'A' || grade === 'BBB') return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    if (grade === 'BB' || grade === 'B') return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const getScoreMessage = () => {
    if (score >= 80) return 'Excellent trust level - Buyers will highly trust you';
    if (score >= 60) return 'Good trust level - Most buyers will feel confident';
    if (score >= 40) return 'Average trust level - Complete missing items to improve';
    return 'Low trust level - Complete verification to activate your badge';
  };

  const items = breakdown ? [
    { label: 'KYC Match', value: breakdown.kycMatch, max: 20, completed: breakdown.kycMatch >= 20 },
    { label: 'SIM Swap Status', value: breakdown.simSwap, max: 20, completed: breakdown.simSwap >= 20 },
    { label: 'Number Verification', value: breakdown.numberVerification, max: 15, completed: breakdown.numberVerification >= 15 },
    { label: 'Age Verification', value: breakdown.ageVerification, max: 15, completed: breakdown.ageVerification >= 15 },
    { label: 'Account Tenure', value: breakdown.tenure, max: 15, completed: breakdown.tenure >= 15 },
    { label: 'Location Verification', value: breakdown.location, max: 15, completed: breakdown.location >= 15 }
  ] : [];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Trust Score</h3>
        <Shield className="w-5 h-5 text-royal-600" />
      </div>
      
      <div className="text-center mb-4">
        <div className="text-5xl font-bold text-royal-600 dark:text-royal-400">
          {score}<span className="text-xl">%</span>
        </div>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getGradeColor()}`}>
          Grade {grade}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          {getScoreMessage()}
        </p>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6">
        <div className="bg-royal-600 h-3 rounded-full transition-all duration-500" style={{ width: `${score}%` }} />
      </div>
      
      {breakdown && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Breakdown by metric:</p>
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span>{item.label}</span>
                <span>{item.value}/{item.max}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${item.completed ? 'bg-green-500' : 'bg-royal-500'}`}
                  style={{ width: `${(item.value / item.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}