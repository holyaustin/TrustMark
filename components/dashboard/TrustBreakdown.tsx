'use client';

import Card from '@/components/ui/Card';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface TrustBreakdownProps {
  breakdown: {
    kycMatch?: number;
    simSwap?: number;
    numberVerification?: number;
    ageVerification?: number;
    tenure?: number;
    location?: number;
  };
  recommendations: string[];
}

export default function TrustBreakdown({ breakdown, recommendations }: TrustBreakdownProps) {
  const maxPoints = {
    kycMatch: 20,
    simSwap: 20,
    numberVerification: 15,
    ageVerification: 15,
    tenure: 15,
    location: 15
  };

  const items = [
    { key: 'kycMatch', label: 'KYC Match', value: breakdown.kycMatch || 0, max: maxPoints.kycMatch },
    { key: 'simSwap', label: 'SIM Swap Status', value: breakdown.simSwap || 0, max: maxPoints.simSwap },
    { key: 'numberVerification', label: 'Number Verification', value: breakdown.numberVerification || 0, max: maxPoints.numberVerification },
    { key: 'ageVerification', label: 'Age Verification', value: breakdown.ageVerification || 0, max: maxPoints.ageVerification },
    { key: 'tenure', label: 'Account Tenure', value: breakdown.tenure || 0, max: maxPoints.tenure },
    { key: 'location', label: 'Location Verification', value: breakdown.location || 0, max: maxPoints.location }
  ];

  const total = items.reduce((sum, i) => sum + i.value, 0);
  const maxTotal = items.reduce((sum, i) => sum + i.max, 0);

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
              <span>{item.label}</span>
              <span>{item.value}/{item.max}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  item.value === item.max ? 'bg-green-500' : 'bg-royal-500'
                }`}
                style={{ width: `${(item.value / item.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {recommendations.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Recommendations:</p>
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