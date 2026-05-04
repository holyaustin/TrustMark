import { ReactNode } from 'react';
import Card from '@/components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  suffix?: string;
}

export default function StatsCard({ title, value, icon, trend, suffix }: StatsCardProps) {
  const isPositiveTrend = trend?.startsWith('+');
  const isNegativeTrend = trend?.startsWith('-');
  
  return (
    <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        {icon && <div className="text-royal-600">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {value}{suffix ? ` ${suffix}` : ''}
        </p>
        {trend && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${
            isPositiveTrend ? 'text-green-600' : isNegativeTrend ? 'text-red-600' : 'text-gray-500'
          }`}>
            {isPositiveTrend && <TrendingUp size={12} />}
            {isNegativeTrend && <TrendingDown size={12} />}
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
}