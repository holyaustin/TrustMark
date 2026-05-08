// components/dashboard/TrustBreakdown.tsx
'use client';

import Card from '@/components/ui/Card';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface TrustBreakdownProps {
  breakdown: {
    kycMatch?: number;
    simSwap?: number;
    numberVerification?: number;
    tenure?: number;
    location?: number;
    kycDataCompleteness?: number;
  };
  recommendations: string[];
}

export default function TrustBreakdown({ breakdown, recommendations }: TrustBreakdownProps) {
  // NEW weights: SIM:15, Number:10, Tenure:25
  const maxPoints = {
    kycMatch: 20,
    simSwap: 15,
    numberVerification: 10,
    tenure: 25,
    location: 15,
    kycDataCompleteness: 15
  };

  const items = [
    { key: 'kycMatch', label: 'KYC Match', value: breakdown.kycMatch || 0, max: maxPoints.kycMatch, description: 'Identity matches SIM registration' },
    { key: 'simSwap', label: 'SIM Swap Status', value: breakdown.simSwap || 0, max: maxPoints.simSwap, description: 'No recent SIM card changes' },
    { key: 'numberVerification', label: 'Number Verification', value: breakdown.numberVerification || 0, max: maxPoints.numberVerification, description: 'Phone number active' },
    { key: 'tenure', label: 'Account Tenure', value: breakdown.tenure || 0, max: maxPoints.tenure, description: 'Years with mobile operator (most important!)' },
    { key: 'location', label: 'Location Verification', value: breakdown.location || 0, max: maxPoints.location, description: 'At business address' },
    { key: 'kycDataCompleteness', label: 'KYC Data Completeness', value: breakdown.kycDataCompleteness || 0, max: maxPoints.kycDataCompleteness, description: 'Complete KYC profile' }
  ];

  const total = items.reduce((sum, i) => sum + i.value, 0);
  const maxTotal = items.reduce((sum, i) => sum + i.max, 0);

  // Calculate percentage for bar display
  const getPercentage = (value: number, max: number) => {
    if (max === 0) return 0;
    const percentage = (value / max) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-royal-600" />
          <h3 className="text-lg font-semibold">Trust Score Breakdown</h3>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{total}/{maxTotal} points</p>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">{item.label}</span>
              <span>{item.value}/{item.max}</span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  item.value === item.max ? 'bg-green-500' : 'bg-royal'
                }`}
                style={{ width: `${getPercentage(item.value, item.max)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
          </div>
        ))}
      </div>
      
      {recommendations.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Recommendations to improve your score:</p>
          <ul className="space-y-1">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <AlertCircle className="w-3 h-3 text-royal-500 mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}