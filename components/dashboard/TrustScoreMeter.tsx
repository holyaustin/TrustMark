// components/dashboard/TrustScoreMeter.tsx
'use client';

import Card from '@/components/ui/Card';
import { Shield } from 'lucide-react';

interface TrustScoreMeterProps {
  score: number;
  grade: string;
  breakdown?: {
    kycMatch: number;
    simSwap: number;
    numberVerification: number;
    tenure: number;
    location: number;
    kycDataCompleteness: number;
  };
}

export default function TrustScoreMeter({ score, grade, breakdown }: TrustScoreMeterProps) {
  // Rainbow colors for grades
  const getGradeColor = () => {
    switch (grade) {
      case 'A+': return 'text-white bg-green-600 dark:bg-green-700';
      case 'A': return 'text-white bg-green-500 dark:bg-green-600';
      case 'B+': return 'text-white bg-lime-500 dark:bg-lime-600';
      case 'B': return 'text-white bg-yellow-500 dark:bg-yellow-600';
      case 'C+': return 'text-white bg-orange-500 dark:bg-orange-600';
      case 'C': return 'text-white bg-red-500 dark:bg-red-600';
      default: return 'text-white bg-gray-500 dark:bg-gray-600';
    }
  };

  const getScoreMessage = () => {
    if (score >= 90) return 'Excellent trust level - Buyers will highly trust you';
    if (score >= 75) return 'Good trust level - Most buyers will feel confident';
    if (score >= 55) return 'Average trust level - Complete missing items to improve';
    return 'Low trust level - Complete verification to activate your badge';
  };

  // 6 metrics with NEW weights
  const items = breakdown ? [
    { label: 'KYC Match', value: breakdown.kycMatch, max: 20, description: 'Identity matches SIM registration' },
    { label: 'SIM Swap Status', value: breakdown.simSwap, max: 15, description: 'No recent SIM card changes' },
    { label: 'Number Verification', value: breakdown.numberVerification, max: 10, description: 'Phone number active' },
    { label: 'Account Tenure', value: breakdown.tenure, max: 25, description: 'Years with mobile operator' },
    { label: 'Location Verification', value: breakdown.location, max: 15, description: 'At business address' },
    { label: 'KYC Data Completeness', value: breakdown.kycDataCompleteness || 0, max: 15, description: 'Complete KYC profile' }
  ] : [];

  // Calculate percentage for each metric (for bar display)
  const getPercentage = (value: number, max: number) => {
    if (max === 0) return 0;
    const percentage = (value / max) * 100;
    return Math.min(percentage, 100);
  };

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
                <span className="font-medium">{item.label}</span>
                <span>{item.value}/{item.max}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${item.value === item.max ? 'bg-green-500' : 'bg-royal'}`}
                  style={{ width: `${getPercentage(item.value, item.max)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}